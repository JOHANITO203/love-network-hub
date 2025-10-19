/**
 * Distributed Hash Table (DHT)
 * Implements consistent hashing for distributed routing and task assignment
 */

import crypto from 'crypto';

export class DistributedHashTable {
  constructor(coordinator, config = {}) {
    this.coordinator = coordinator;
    this.config = {
      virtualNodes: config.virtualNodes || 150,
      replicationFactor: config.replicationFactor || 3,
      ...config
    };

    this.ring = new Map();
    this.keyMap = new Map();
    this.sortedKeys = [];
  }

  /**
   * Initialize DHT
   */
  async initialize() {
    console.log('[DHT] Initializing distributed hash table');

    // Add self to ring
    this.addNode(this.coordinator.nodeId);

    // Add existing peers
    for (const peerId of this.coordinator.peers.keys()) {
      this.addNode(peerId);
    }

    // Listen for peer changes
    this.coordinator.on('peer_connected', (peer) => {
      this.addNode(peer.id);
    });

    this.coordinator.on('peer_disconnected', ({ peerId }) => {
      this.removeNode(peerId);
    });
  }

  /**
   * Add node to DHT ring
   */
  addNode(nodeId) {
    console.log(`[DHT] Adding node ${nodeId} to ring`);

    // Create virtual nodes for better distribution
    for (let i = 0; i < this.config.virtualNodes; i++) {
      const virtualKey = this.hash(`${nodeId}:${i}`);
      this.ring.set(virtualKey, nodeId);
    }

    // Update sorted keys
    this.updateSortedKeys();
  }

  /**
   * Remove node from DHT ring
   */
  removeNode(nodeId) {
    console.log(`[DHT] Removing node ${nodeId} from ring`);

    // Remove virtual nodes
    for (let i = 0; i < this.config.virtualNodes; i++) {
      const virtualKey = this.hash(`${nodeId}:${i}`);
      this.ring.delete(virtualKey);
    }

    // Update sorted keys
    this.updateSortedKeys();

    // Redistribute keys owned by removed node
    this.redistributeKeys(nodeId);
  }

  /**
   * Hash function for consistent hashing
   */
  hash(key) {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  /**
   * Update sorted keys array
   */
  updateSortedKeys() {
    this.sortedKeys = Array.from(this.ring.keys()).sort();
  }

  /**
   * Find responsible node for a key
   */
  findNode(key) {
    if (this.sortedKeys.length === 0) {
      return this.coordinator.nodeId;
    }

    const keyHash = this.hash(key);

    // Binary search for successor node
    let left = 0;
    let right = this.sortedKeys.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midHash = this.sortedKeys[mid];

      if (keyHash === midHash) {
        return this.ring.get(midHash);
      } else if (keyHash < midHash) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Wrap around if necessary
    const successorIdx = left < this.sortedKeys.length ? left : 0;
    return this.ring.get(this.sortedKeys[successorIdx]);
  }

  /**
   * Find successor nodes for replication
   */
  findSuccessors(key, count = this.config.replicationFactor) {
    if (this.sortedKeys.length === 0) {
      return [this.coordinator.nodeId];
    }

    const keyHash = this.hash(key);
    const successors = new Set();

    // Find position in ring
    let idx = this.sortedKeys.findIndex(k => k >= keyHash);
    if (idx === -1) idx = 0;

    // Collect unique nodes
    while (successors.size < count && successors.size < this.ring.size) {
      const nodeId = this.ring.get(this.sortedKeys[idx]);
      successors.add(nodeId);
      idx = (idx + 1) % this.sortedKeys.length;
    }

    return Array.from(successors);
  }

  /**
   * Store key-value pair with replication
   */
  async store(key, value) {
    const successors = this.findSuccessors(key);

    console.log(`[DHT] Storing key ${key} on nodes:`, successors);

    const results = [];

    for (const nodeId of successors) {
      if (nodeId === this.coordinator.nodeId) {
        // Store locally
        this.keyMap.set(key, {
          value,
          timestamp: Date.now(),
          replicas: successors
        });
        results.push({ nodeId, success: true });
      } else {
        // Replicate to peer
        try {
          await this.coordinator.sendMessage(nodeId, {
            type: 'dht_store',
            key,
            value,
            replicas: successors
          });
          results.push({ nodeId, success: true });
        } catch (error) {
          results.push({ nodeId, success: false, error: error.message });
        }
      }
    }

    return results;
  }

  /**
   * Retrieve value for key
   */
  async retrieve(key) {
    const responsibleNode = this.findNode(key);

    console.log(`[DHT] Retrieving key ${key} from node ${responsibleNode}`);

    if (responsibleNode === this.coordinator.nodeId) {
      // Retrieve locally
      return this.keyMap.get(key);
    } else {
      // Request from peer
      try {
        const response = await this.coordinator.sendMessage(responsibleNode, {
          type: 'dht_retrieve',
          key
        });
        return response.value;
      } catch (error) {
        console.error(`[DHT] Failed to retrieve from ${responsibleNode}:`, error.message);
        return null;
      }
    }
  }

  /**
   * Redistribute keys when node leaves
   */
  redistributeKeys(removedNodeId) {
    console.log(`[DHT] Redistributing keys from ${removedNodeId}`);

    const keysToRedistribute = [];

    for (const [key, data] of this.keyMap.entries()) {
      if (data.replicas && data.replicas.includes(removedNodeId)) {
        keysToRedistribute.push(key);
      }
    }

    for (const key of keysToRedistribute) {
      const data = this.keyMap.get(key);
      this.store(key, data.value);
    }
  }

  /**
   * Get DHT status
   */
  getStatus() {
    const nodes = new Set(this.ring.values());

    return {
      totalNodes: nodes.size,
      virtualNodes: this.ring.size,
      storedKeys: this.keyMap.size,
      sortedKeysLength: this.sortedKeys.length,
      config: this.config
    };
  }
}

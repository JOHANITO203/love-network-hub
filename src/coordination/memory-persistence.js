/**
 * Memory Persistence Manager
 * Handles distributed memory storage and retrieval
 */

class MemoryPersistence {
  constructor(config) {
    this.config = config;
    this.store = new Map();
    this.replicationNodes = [];
    this.replicationFactor = config.memory_synchronization.replication_factor || 3;
  }

  /**
   * Store value with replication
   */
  async store(key, value, namespace = 'default') {
    const fullKey = `${namespace}:${key}`;
    const timestamp = Date.now();

    const entry = {
      key: fullKey,
      value,
      namespace,
      timestamp,
      version: this.getNextVersion(fullKey),
      replicas: []
    };

    // Store locally
    this.store.set(fullKey, entry);

    // Replicate to other nodes
    await this.replicate(entry);

    return {
      success: true,
      key: fullKey,
      version: entry.version,
      replicas: entry.replicas.length
    };
  }

  /**
   * Retrieve value with conflict resolution
   */
  async retrieve(key, namespace = 'default') {
    const fullKey = `${namespace}:${key}`;

    // Check local store
    let entry = this.store.get(fullKey);

    if (!entry) {
      // Try to retrieve from replicas
      entry = await this.retrieveFromReplicas(fullKey);
    }

    return entry ? entry.value : null;
  }

  /**
   * Replicate to multiple nodes
   */
  async replicate(entry) {
    const targetNodes = this.selectReplicationNodes(this.replicationFactor);

    const replicationPromises = targetNodes.map(node =>
      this.replicateToNode(node, entry)
    );

    const results = await Promise.allSettled(replicationPromises);

    entry.replicas = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    return entry.replicas;
  }

  async replicateToNode(node, entry) {
    // In production, would send over network
    // For now, simulate replication
    return {
      node: node.id,
      timestamp: Date.now(),
      status: 'replicated'
    };
  }

  /**
   * Retrieve from replica nodes
   */
  async retrieveFromReplicas(key) {
    for (const node of this.replicationNodes) {
      const entry = await this.retrieveFromNode(node, key);
      if (entry) return entry;
    }
    return null;
  }

  async retrieveFromNode(node, key) {
    // In production, would fetch over network
    return null;
  }

  /**
   * Conflict resolution (Last-Write-Wins)
   */
  resolveConflict(entries) {
    if (entries.length === 0) return null;
    if (entries.length === 1) return entries[0];

    // Last-Write-Wins: return entry with latest timestamp
    return entries.reduce((latest, current) =>
      current.timestamp > latest.timestamp ? current : latest
    );
  }

  /**
   * Select nodes for replication
   */
  selectReplicationNodes(count) {
    if (this.replicationNodes.length <= count) {
      return this.replicationNodes;
    }

    // Simple round-robin selection
    // In production, would use consistent hashing
    const selected = [];
    for (let i = 0; i < count && i < this.replicationNodes.length; i++) {
      selected.push(this.replicationNodes[i]);
    }
    return selected;
  }

  /**
   * Version management
   */
  getNextVersion(key) {
    const existing = this.store.get(key);
    return existing ? existing.version + 1 : 1;
  }

  /**
   * Query by namespace
   */
  queryNamespace(namespace) {
    const results = [];

    for (const [key, entry] of this.store) {
      if (entry.namespace === namespace) {
        results.push({ key, ...entry });
      }
    }

    return results;
  }

  /**
   * Cleanup old entries
   */
  cleanup(maxAge = 86400000) { // 24 hours default
    const now = Date.now();
    const threshold = now - maxAge;

    for (const [key, entry] of this.store) {
      if (entry.timestamp < threshold) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Register replication node
   */
  registerNode(node) {
    this.replicationNodes.push(node);
  }

  /**
   * Get statistics
   */
  getStats() {
    const namespaces = new Map();

    for (const [_, entry] of this.store) {
      const count = namespaces.get(entry.namespace) || 0;
      namespaces.set(entry.namespace, count + 1);
    }

    return {
      total_entries: this.store.size,
      namespaces: Object.fromEntries(namespaces),
      replication_nodes: this.replicationNodes.length,
      replication_factor: this.replicationFactor
    };
  }
}

module.exports = MemoryPersistence;

/**
 * Mesh Network Coordinator
 * Implements peer-to-peer mesh topology with fault tolerance and distributed consensus
 */

import { EventEmitter } from 'events';
import { GossipProtocol } from './protocols/GossipProtocol.js';
import { ByzantineConsensus } from './consensus/ByzantineConsensus.js';
import { HeartbeatMonitor } from './monitoring/HeartbeatMonitor.js';
import { DistributedHashTable } from './protocols/DistributedHashTable.js';

export class MeshCoordinator extends EventEmitter {
  constructor(nodeId, config = {}) {
    super();
    this.nodeId = nodeId;
    this.config = {
      maxPeers: config.maxPeers || 5,
      heartbeatInterval: config.heartbeatInterval || 3000,
      heartbeatTimeout: config.heartbeatTimeout || 10000,
      consensusThreshold: config.consensusThreshold || 0.67,
      gossipFanout: config.gossipFanout || 3,
      ...config
    };

    // Network state
    this.peers = new Map();
    this.connections = new Map();
    this.topology = new Map();
    this.networkHealth = {
      connectivity: 0,
      latency: 0,
      throughput: 0,
      partitioned: false
    };

    // Initialize components
    this.gossip = new GossipProtocol(this, {
      fanout: this.config.gossipFanout,
      interval: this.config.heartbeatInterval
    });

    this.consensus = new ByzantineConsensus(this, {
      threshold: this.config.consensusThreshold
    });

    this.heartbeat = new HeartbeatMonitor(this, {
      interval: this.config.heartbeatInterval,
      timeout: this.config.heartbeatTimeout
    });

    this.dht = new DistributedHashTable(this);

    this.initialized = false;
  }

  /**
   * Initialize mesh network and establish peer connections
   */
  async initialize() {
    if (this.initialized) {
      throw new Error('Mesh coordinator already initialized');
    }

    console.log(`[Mesh] Initializing node ${this.nodeId}`);

    // Start heartbeat monitoring
    await this.heartbeat.start();

    // Initialize DHT for distributed routing
    await this.dht.initialize();

    // Start gossip protocol for state dissemination
    await this.gossip.start();

    this.initialized = true;
    this.emit('initialized', { nodeId: this.nodeId });

    console.log(`[Mesh] Node ${this.nodeId} initialized successfully`);
    return this;
  }

  /**
   * Connect to a peer node
   */
  async connectPeer(peerId, address) {
    if (this.peers.has(peerId)) {
      console.log(`[Mesh] Already connected to peer ${peerId}`);
      return this.peers.get(peerId);
    }

    if (this.peers.size >= this.config.maxPeers) {
      throw new Error(`Maximum peer limit (${this.config.maxPeers}) reached`);
    }

    console.log(`[Mesh] Connecting to peer ${peerId} at ${address}`);

    const peer = {
      id: peerId,
      address,
      connected: true,
      connectedAt: Date.now(),
      lastHeartbeat: Date.now(),
      latency: 0,
      reliability: 1.0,
      capabilities: []
    };

    this.peers.set(peerId, peer);
    this.topology.set(peerId, new Set([this.nodeId]));

    // Notify peer of connection
    await this.sendMessage(peerId, {
      type: 'peer_connect',
      from: this.nodeId,
      timestamp: Date.now()
    });

    this.emit('peer_connected', peer);
    this.updateNetworkHealth();

    return peer;
  }

  /**
   * Disconnect from a peer
   */
  async disconnectPeer(peerId) {
    if (!this.peers.has(peerId)) {
      console.log(`[Mesh] Peer ${peerId} not found`);
      return;
    }

    console.log(`[Mesh] Disconnecting from peer ${peerId}`);

    const peer = this.peers.get(peerId);
    peer.connected = false;

    await this.sendMessage(peerId, {
      type: 'peer_disconnect',
      from: this.nodeId,
      timestamp: Date.now()
    });

    this.peers.delete(peerId);
    this.topology.delete(peerId);

    this.emit('peer_disconnected', { peerId });
    this.updateNetworkHealth();
  }

  /**
   * Send message to a specific peer
   */
  async sendMessage(peerId, message) {
    const peer = this.peers.get(peerId);
    if (!peer || !peer.connected) {
      throw new Error(`Peer ${peerId} not connected`);
    }

    const envelope = {
      ...message,
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: this.nodeId,
      to: peerId,
      timestamp: Date.now()
    };

    // Simulate network delay
    const startTime = Date.now();
    await this.simulateNetworkDelay();

    // Update peer latency
    peer.latency = Date.now() - startTime;

    this.emit('message_sent', envelope);
    return envelope;
  }

  /**
   * Broadcast message to all connected peers
   */
  async broadcast(message) {
    const results = [];

    for (const [peerId, peer] of this.peers.entries()) {
      if (peer.connected) {
        try {
          const result = await this.sendMessage(peerId, message);
          results.push({ peerId, success: true, result });
        } catch (error) {
          results.push({ peerId, success: false, error: error.message });
        }
      }
    }

    return results;
  }

  /**
   * Handle incoming message from peer
   */
  async handleMessage(envelope) {
    const { type, from, data } = envelope;

    switch (type) {
      case 'peer_connect':
        await this.handlePeerConnect(from, envelope);
        break;

      case 'peer_disconnect':
        await this.handlePeerDisconnect(from);
        break;

      case 'heartbeat':
        await this.handleHeartbeat(from, envelope);
        break;

      case 'gossip':
        await this.gossip.handleGossip(from, data);
        break;

      case 'consensus_proposal':
        await this.consensus.handleProposal(from, data);
        break;

      case 'consensus_vote':
        await this.consensus.handleVote(from, data);
        break;

      default:
        this.emit('message_received', envelope);
    }
  }

  /**
   * Handle peer connection request
   */
  async handlePeerConnect(peerId, envelope) {
    if (!this.peers.has(peerId)) {
      await this.connectPeer(peerId, envelope.address || 'unknown');
    }

    // Update peer's last heartbeat
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastHeartbeat = Date.now();
    }
  }

  /**
   * Handle peer disconnection
   */
  async handlePeerDisconnect(peerId) {
    if (this.peers.has(peerId)) {
      const peer = this.peers.get(peerId);
      peer.connected = false;
      this.peers.delete(peerId);
      this.topology.delete(peerId);
      this.emit('peer_disconnected', { peerId });
      this.updateNetworkHealth();
    }
  }

  /**
   * Handle heartbeat message
   */
  async handleHeartbeat(peerId, envelope) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.lastHeartbeat = Date.now();
      peer.latency = envelope.latency || 0;
      this.emit('heartbeat_received', { peerId, peer });
    }
  }

  /**
   * Propose a decision for distributed consensus
   */
  async proposeConsensus(proposal) {
    return await this.consensus.propose(proposal);
  }

  /**
   * Detect network partitions
   */
  async detectPartitions() {
    const reachablePeers = Array.from(this.peers.values())
      .filter(p => p.connected && (Date.now() - p.lastHeartbeat) < this.config.heartbeatTimeout);

    const totalPeers = this.peers.size;
    const reachableCount = reachablePeers.length;

    const partitioned = totalPeers > 0 && (reachableCount / totalPeers) < 0.5;

    if (partitioned !== this.networkHealth.partitioned) {
      this.networkHealth.partitioned = partitioned;
      this.emit('partition_detected', { partitioned, reachableCount, totalPeers });
    }

    return partitioned;
  }

  /**
   * Heal network partition
   */
  async healPartition() {
    console.log('[Mesh] Attempting to heal network partition');

    // Remove failed peers
    const now = Date.now();
    const failedPeers = [];

    for (const [peerId, peer] of this.peers.entries()) {
      if (now - peer.lastHeartbeat > this.config.heartbeatTimeout) {
        failedPeers.push(peerId);
      }
    }

    for (const peerId of failedPeers) {
      await this.disconnectPeer(peerId);
    }

    // Trigger peer discovery
    this.emit('peer_discovery_needed');

    await this.updateNetworkHealth();
  }

  /**
   * Update network health metrics
   */
  async updateNetworkHealth() {
    const connectedPeers = Array.from(this.peers.values())
      .filter(p => p.connected);

    const totalPeers = this.peers.size;
    const connectivity = totalPeers > 0 ? connectedPeers.length / totalPeers : 0;

    const avgLatency = connectedPeers.length > 0
      ? connectedPeers.reduce((sum, p) => sum + p.latency, 0) / connectedPeers.length
      : 0;

    this.networkHealth = {
      connectivity,
      latency: avgLatency,
      throughput: this.calculateThroughput(),
      partitioned: await this.detectPartitions()
    };

    this.emit('health_updated', this.networkHealth);
    return this.networkHealth;
  }

  /**
   * Calculate network throughput
   */
  calculateThroughput() {
    // Placeholder - would track actual message rates
    return this.peers.size * 10; // messages per second estimate
  }

  /**
   * Get mesh network status
   */
  getStatus() {
    return {
      nodeId: this.nodeId,
      initialized: this.initialized,
      peers: Array.from(this.peers.values()),
      topology: Object.fromEntries(
        Array.from(this.topology.entries()).map(([k, v]) => [k, Array.from(v)])
      ),
      health: this.networkHealth,
      config: this.config
    };
  }

  /**
   * Simulate network delay (for testing)
   */
  async simulateNetworkDelay() {
    const delay = Math.random() * 50 + 10; // 10-60ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Shutdown mesh coordinator
   */
  async shutdown() {
    console.log(`[Mesh] Shutting down node ${this.nodeId}`);

    // Stop all services
    await this.heartbeat.stop();
    await this.gossip.stop();

    // Disconnect all peers
    const peerIds = Array.from(this.peers.keys());
    for (const peerId of peerIds) {
      await this.disconnectPeer(peerId);
    }

    this.initialized = false;
    this.emit('shutdown');
  }
}

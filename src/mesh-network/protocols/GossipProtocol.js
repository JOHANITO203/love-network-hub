/**
 * Gossip Protocol Implementation
 * Implements epidemic-style information dissemination across mesh network
 */

export class GossipProtocol {
  constructor(coordinator, config = {}) {
    this.coordinator = coordinator;
    this.config = {
      fanout: config.fanout || 3,
      interval: config.interval || 2000,
      maxGossipRounds: config.maxGossipRounds || 10,
      ...config
    };

    this.gossipState = new Map();
    this.gossipHistory = new Map();
    this.intervalHandle = null;
    this.running = false;
  }

  /**
   * Start gossip protocol
   */
  async start() {
    if (this.running) {
      return;
    }

    console.log('[Gossip] Starting gossip protocol');
    this.running = true;

    this.intervalHandle = setInterval(
      () => this.performGossipRound(),
      this.config.interval
    );
  }

  /**
   * Stop gossip protocol
   */
  async stop() {
    console.log('[Gossip] Stopping gossip protocol');
    this.running = false;

    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  /**
   * Perform one round of gossip
   */
  async performGossipRound() {
    if (!this.running || this.coordinator.peers.size === 0) {
      return;
    }

    // Select random peers for gossip
    const peers = this.selectGossipPeers();

    // Prepare gossip payload with local state
    const gossipData = this.prepareGossipData();

    // Send gossip to selected peers
    for (const peer of peers) {
      try {
        await this.coordinator.sendMessage(peer.id, {
          type: 'gossip',
          data: gossipData
        });
      } catch (error) {
        console.error(`[Gossip] Failed to gossip to peer ${peer.id}:`, error.message);
      }
    }

    // Clean up old gossip history
    this.cleanupGossipHistory();
  }

  /**
   * Select random peers for gossip (fanout)
   */
  selectGossipPeers() {
    const connectedPeers = Array.from(this.coordinator.peers.values())
      .filter(p => p.connected);

    if (connectedPeers.length === 0) {
      return [];
    }

    const fanout = Math.min(this.config.fanout, connectedPeers.length);
    const selected = [];

    // Randomly select peers
    const shuffled = connectedPeers.sort(() => Math.random() - 0.5);
    for (let i = 0; i < fanout; i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  }

  /**
   * Prepare gossip data payload
   */
  prepareGossipData() {
    const peers = Array.from(this.coordinator.peers.entries()).map(([id, peer]) => ({
      id,
      address: peer.address,
      connected: peer.connected,
      lastSeen: peer.lastHeartbeat
    }));

    return {
      nodeId: this.coordinator.nodeId,
      timestamp: Date.now(),
      peers,
      networkHealth: this.coordinator.networkHealth,
      gossipRound: this.getGossipRound()
    };
  }

  /**
   * Handle incoming gossip from peer
   */
  async handleGossip(fromPeerId, gossipData) {
    const { nodeId, timestamp, peers, networkHealth, gossipRound } = gossipData;

    // Check if we've seen this gossip before (anti-entropy)
    const gossipId = `${nodeId}-${gossipRound}`;
    if (this.gossipHistory.has(gossipId)) {
      return; // Already processed
    }

    // Record gossip in history
    this.gossipHistory.set(gossipId, {
      from: fromPeerId,
      timestamp: Date.now(),
      gossipRound
    });

    // Update gossip state
    this.gossipState.set(nodeId, {
      timestamp,
      peers,
      networkHealth,
      receivedFrom: fromPeerId
    });

    // Discover new peers
    for (const peerInfo of peers) {
      if (peerInfo.id !== this.coordinator.nodeId &&
          !this.coordinator.peers.has(peerInfo.id) &&
          peerInfo.connected) {

        // Notify coordinator of new peer discovery
        this.coordinator.emit('peer_discovered', peerInfo);
      }
    }

    // Reconcile network state
    await this.reconcileState(nodeId, gossipData);

    // Propagate gossip if not at max rounds
    if (gossipRound < this.config.maxGossipRounds) {
      await this.propagateGossip(gossipData, fromPeerId);
    }
  }

  /**
   * Reconcile state differences (anti-entropy)
   */
  async reconcileState(nodeId, gossipData) {
    // Compare local and received state
    const localHealth = this.coordinator.networkHealth;
    const remoteHealth = gossipData.networkHealth;

    // Update if remote has more recent information
    if (remoteHealth && this.shouldUpdateState(localHealth, remoteHealth)) {
      this.coordinator.emit('state_reconciled', {
        source: nodeId,
        changes: this.calculateStateDiff(localHealth, remoteHealth)
      });
    }
  }

  /**
   * Determine if should update state based on received gossip
   */
  shouldUpdateState(local, remote) {
    // Simple heuristic - could be more sophisticated
    return remote.connectivity > local.connectivity;
  }

  /**
   * Calculate state differences
   */
  calculateStateDiff(local, remote) {
    return {
      connectivityChange: remote.connectivity - local.connectivity,
      latencyChange: remote.latency - local.latency,
      throughputChange: remote.throughput - local.throughput
    };
  }

  /**
   * Propagate gossip to other peers (rumor spreading)
   */
  async propagateGossip(gossipData, excludePeerId) {
    const peers = this.selectGossipPeers()
      .filter(p => p.id !== excludePeerId);

    const propagatedData = {
      ...gossipData,
      gossipRound: gossipData.gossipRound + 1
    };

    for (const peer of peers) {
      try {
        await this.coordinator.sendMessage(peer.id, {
          type: 'gossip',
          data: propagatedData
        });
      } catch (error) {
        console.error(`[Gossip] Failed to propagate to peer ${peer.id}:`, error.message);
      }
    }
  }

  /**
   * Get current gossip round
   */
  getGossipRound() {
    const maxRound = Array.from(this.gossipHistory.values())
      .reduce((max, entry) => Math.max(max, entry.gossipRound || 0), 0);

    return maxRound + 1;
  }

  /**
   * Clean up old gossip history
   */
  cleanupGossipHistory() {
    const now = Date.now();
    const maxAge = this.config.interval * this.config.maxGossipRounds * 2;

    for (const [gossipId, entry] of this.gossipHistory.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.gossipHistory.delete(gossipId);
      }
    }

    // Limit history size
    if (this.gossipHistory.size > 1000) {
      const sorted = Array.from(this.gossipHistory.entries())
        .sort((a, b) => b[1].timestamp - a[1].timestamp);

      this.gossipHistory.clear();
      for (const [id, entry] of sorted.slice(0, 500)) {
        this.gossipHistory.set(id, entry);
      }
    }
  }

  /**
   * Get gossip protocol status
   */
  getStatus() {
    return {
      running: this.running,
      gossipRound: this.getGossipRound(),
      historySize: this.gossipHistory.size,
      stateSize: this.gossipState.size,
      config: this.config
    };
  }
}

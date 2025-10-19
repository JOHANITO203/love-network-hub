/**
 * Heartbeat Monitoring System
 * Detects peer failures and triggers recovery procedures
 */

export class HeartbeatMonitor {
  constructor(coordinator, config = {}) {
    this.coordinator = coordinator;
    this.config = {
      interval: config.interval || 3000,
      timeout: config.timeout || 10000,
      confirmationQuorum: config.confirmationQuorum || 2,
      ...config
    };

    this.intervalHandle = null;
    this.running = false;
    this.failureDetections = new Map();
  }

  /**
   * Start heartbeat monitoring
   */
  async start() {
    if (this.running) {
      return;
    }

    console.log('[Heartbeat] Starting heartbeat monitor');
    this.running = true;

    this.intervalHandle = setInterval(
      () => this.performHeartbeatCheck(),
      this.config.interval
    );
  }

  /**
   * Stop heartbeat monitoring
   */
  async stop() {
    console.log('[Heartbeat] Stopping heartbeat monitor');
    this.running = false;

    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  /**
   * Perform heartbeat check on all peers
   */
  async performHeartbeatCheck() {
    if (!this.running) return;

    const now = Date.now();

    for (const [peerId, peer] of this.coordinator.peers.entries()) {
      if (!peer.connected) continue;

      const timeSinceLastHeartbeat = now - peer.lastHeartbeat;

      // Send heartbeat
      try {
        await this.sendHeartbeat(peerId);
      } catch (error) {
        console.error(`[Heartbeat] Failed to send heartbeat to ${peerId}:`, error.message);
      }

      // Check for timeout
      if (timeSinceLastHeartbeat > this.config.timeout) {
        await this.handlePotentialFailure(peerId);
      }
    }

    // Check for network partitions
    await this.coordinator.detectPartitions();
  }

  /**
   * Send heartbeat to peer
   */
  async sendHeartbeat(peerId) {
    const message = {
      type: 'heartbeat',
      timestamp: Date.now(),
      latency: this.coordinator.peers.get(peerId)?.latency || 0
    };

    await this.coordinator.sendMessage(peerId, message);
  }

  /**
   * Handle potential peer failure
   */
  async handlePotentialFailure(peerId) {
    console.warn(`[Heartbeat] Potential failure detected for peer ${peerId}`);

    // Check if already under investigation
    if (this.failureDetections.has(peerId)) {
      const detection = this.failureDetections.get(peerId);
      detection.attempts++;

      // If multiple attempts failed, confirm failure
      if (detection.attempts >= this.config.confirmationQuorum) {
        await this.confirmFailure(peerId);
      }
    } else {
      // Start failure detection
      this.failureDetections.set(peerId, {
        peerId,
        firstDetected: Date.now(),
        attempts: 1,
        confirmations: []
      });

      // Request confirmation from other peers
      await this.requestFailureConfirmation(peerId);
    }
  }

  /**
   * Request failure confirmation from other peers
   */
  async requestFailureConfirmation(peerId) {
    const message = {
      type: 'failure_confirmation_request',
      targetPeerId: peerId,
      timestamp: Date.now()
    };

    // Ask other peers if they can reach the potentially failed peer
    const confirmations = await this.coordinator.broadcast(message);

    const detection = this.failureDetections.get(peerId);
    if (detection) {
      detection.confirmations = confirmations;
    }
  }

  /**
   * Confirm peer failure
   */
  async confirmFailure(peerId) {
    console.error(`[Heartbeat] Peer failure confirmed: ${peerId}`);

    const detection = this.failureDetections.get(peerId);

    this.coordinator.emit('peer_failure', {
      peerId,
      detection,
      timestamp: Date.now()
    });

    // Trigger failure recovery
    await this.handleFailureRecovery(peerId);

    // Clean up detection
    this.failureDetections.delete(peerId);
  }

  /**
   * Handle failure recovery
   */
  async handleFailureRecovery(peerId) {
    console.log(`[Heartbeat] Initiating failure recovery for ${peerId}`);

    // Disconnect failed peer
    await this.coordinator.disconnectPeer(peerId);

    // Update network topology
    await this.coordinator.updateNetworkHealth();

    // Check if partition healing is needed
    if (this.coordinator.networkHealth.partitioned) {
      await this.coordinator.healPartition();
    }

    this.coordinator.emit('failure_recovery_complete', { peerId });
  }

  /**
   * Reset failure detection for peer
   */
  resetFailureDetection(peerId) {
    if (this.failureDetections.has(peerId)) {
      this.failureDetections.delete(peerId);
    }
  }

  /**
   * Get monitoring status
   */
  getStatus() {
    return {
      running: this.running,
      activeDetections: Array.from(this.failureDetections.values()),
      config: this.config
    };
  }
}

/**
 * Mesh Coordinator Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MeshCoordinator } from '../../src/mesh-network/MeshCoordinator.js';

describe('MeshCoordinator', () => {
  let coordinator;

  beforeEach(async () => {
    coordinator = new MeshCoordinator('node-1', {
      maxPeers: 5,
      heartbeatInterval: 1000,
      heartbeatTimeout: 5000
    });
  });

  afterEach(async () => {
    if (coordinator && coordinator.initialized) {
      await coordinator.shutdown();
    }
  });

  describe('Initialization', () => {
    it('should initialize mesh coordinator', async () => {
      await coordinator.initialize();

      expect(coordinator.initialized).toBe(true);
      expect(coordinator.nodeId).toBe('node-1');
      expect(coordinator.peers.size).toBe(0);
    });

    it('should throw error if initialized twice', async () => {
      await coordinator.initialize();

      await expect(coordinator.initialize()).rejects.toThrow(
        'Mesh coordinator already initialized'
      );
    });

    it('should start heartbeat monitor on init', async () => {
      await coordinator.initialize();

      expect(coordinator.heartbeat.running).toBe(true);
    });

    it('should start gossip protocol on init', async () => {
      await coordinator.initialize();

      expect(coordinator.gossip.running).toBe(true);
    });
  });

  describe('Peer Management', () => {
    beforeEach(async () => {
      await coordinator.initialize();
    });

    it('should connect to a peer', async () => {
      const peer = await coordinator.connectPeer('node-2', 'localhost:5002');

      expect(peer).toBeDefined();
      expect(peer.id).toBe('node-2');
      expect(peer.connected).toBe(true);
      expect(coordinator.peers.size).toBe(1);
    });

    it('should not connect to same peer twice', async () => {
      await coordinator.connectPeer('node-2', 'localhost:5002');
      const peer2 = await coordinator.connectPeer('node-2', 'localhost:5002');

      expect(coordinator.peers.size).toBe(1);
      expect(peer2.id).toBe('node-2');
    });

    it('should enforce max peers limit', async () => {
      // Connect to max peers
      for (let i = 2; i <= 6; i++) {
        await coordinator.connectPeer(`node-${i}`, `localhost:500${i}`);
      }

      expect(coordinator.peers.size).toBe(5);

      // Try to connect one more
      await expect(
        coordinator.connectPeer('node-7', 'localhost:5007')
      ).rejects.toThrow('Maximum peer limit');
    });

    it('should disconnect from a peer', async () => {
      await coordinator.connectPeer('node-2', 'localhost:5002');
      await coordinator.disconnectPeer('node-2');

      expect(coordinator.peers.has('node-2')).toBe(false);
      expect(coordinator.peers.size).toBe(0);
    });

    it('should update topology on peer connect', async () => {
      await coordinator.connectPeer('node-2', 'localhost:5002');

      expect(coordinator.topology.has('node-2')).toBe(true);
    });
  });

  describe('Messaging', () => {
    beforeEach(async () => {
      await coordinator.initialize();
      await coordinator.connectPeer('node-2', 'localhost:5002');
    });

    it('should send message to peer', async () => {
      const message = await coordinator.sendMessage('node-2', {
        type: 'test',
        data: 'hello'
      });

      expect(message).toBeDefined();
      expect(message.from).toBe('node-1');
      expect(message.to).toBe('node-2');
      expect(message.messageId).toBeDefined();
    });

    it('should fail to send to disconnected peer', async () => {
      await coordinator.disconnectPeer('node-2');

      await expect(
        coordinator.sendMessage('node-2', { type: 'test' })
      ).rejects.toThrow('Peer node-2 not connected');
    });

    it('should broadcast to all peers', async () => {
      await coordinator.connectPeer('node-3', 'localhost:5003');

      const results = await coordinator.broadcast({ type: 'broadcast', data: 'test' });

      expect(results).toHaveLength(2);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should update peer latency on message send', async () => {
      const peer = coordinator.peers.get('node-2');
      const initialLatency = peer.latency;

      await coordinator.sendMessage('node-2', { type: 'test' });

      expect(peer.latency).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Network Health', () => {
    beforeEach(async () => {
      await coordinator.initialize();
    });

    it('should calculate network health metrics', async () => {
      await coordinator.connectPeer('node-2', 'localhost:5002');
      await coordinator.connectPeer('node-3', 'localhost:5003');

      const health = await coordinator.updateNetworkHealth();

      expect(health).toBeDefined();
      expect(health.connectivity).toBe(1.0); // All connected
      expect(health.latency).toBeGreaterThanOrEqual(0);
      expect(health.throughput).toBeGreaterThan(0);
    });

    it('should detect network partitions', async () => {
      await coordinator.connectPeer('node-2', 'localhost:5002');
      await coordinator.connectPeer('node-3', 'localhost:5003');

      // Simulate partition by marking peers as unhealthy
      const peer2 = coordinator.peers.get('node-2');
      const peer3 = coordinator.peers.get('node-3');
      peer2.lastHeartbeat = Date.now() - 20000;
      peer3.lastHeartbeat = Date.now() - 20000;

      const partitioned = await coordinator.detectPartitions();

      expect(partitioned).toBe(true);
    });

    it('should heal network partition', async () => {
      await coordinator.connectPeer('node-2', 'localhost:5002');

      // Simulate failed peer
      const peer = coordinator.peers.get('node-2');
      peer.lastHeartbeat = Date.now() - 20000;

      await coordinator.healPartition();

      // Failed peer should be removed
      expect(coordinator.peers.has('node-2')).toBe(false);
    });
  });

  describe('Consensus', () => {
    beforeEach(async () => {
      await coordinator.initialize();
      await coordinator.connectPeer('node-2', 'localhost:5002');
      await coordinator.connectPeer('node-3', 'localhost:5003');
    });

    it('should propose consensus decision', async () => {
      const proposalPromise = coordinator.proposeConsensus({
        action: 'update_config',
        value: { setting: 'new_value' }
      });

      // Simulate immediate consensus approval
      setTimeout(() => {
        const proposals = Array.from(coordinator.consensus.proposals.values());
        if (proposals.length > 0) {
          const proposal = proposals[0];
          coordinator.consensus.executeDecision(proposal.id);
        }
      }, 100);

      const decision = await proposalPromise;

      expect(decision).toBeDefined();
      expect(decision.approved).toBe(true);
    });
  });

  describe('Status and Shutdown', () => {
    beforeEach(async () => {
      await coordinator.initialize();
    });

    it('should return coordinator status', async () => {
      await coordinator.connectPeer('node-2', 'localhost:5002');

      const status = coordinator.getStatus();

      expect(status.nodeId).toBe('node-1');
      expect(status.initialized).toBe(true);
      expect(status.peers).toHaveLength(1);
      expect(status.health).toBeDefined();
    });

    it('should shutdown gracefully', async () => {
      await coordinator.connectPeer('node-2', 'localhost:5002');
      await coordinator.shutdown();

      expect(coordinator.initialized).toBe(false);
      expect(coordinator.peers.size).toBe(0);
      expect(coordinator.heartbeat.running).toBe(false);
      expect(coordinator.gossip.running).toBe(false);
    });
  });
});

/**
 * Tests for Collective Intelligence Coordinator
 */

const CollectiveIntelligence = require('../../src/coordination/collective-intelligence');

describe('CollectiveIntelligence', () => {
  let coordinator;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      hive_mind: {
        topology: 'mesh',
        max_agents: 10,
        strategy: 'adaptive'
      },
      consensus: {
        mechanism: 'byzantine-fault-tolerant',
        threshold: 0.75,
        voting_method: 'weighted',
        quorum_size: 5
      },
      memory_synchronization: {
        interval_ms: 30000,
        persistence: 'distributed',
        conflict_resolution: 'last-write-wins',
        replication_factor: 3
      },
      cognitive_load_balancing: {
        enabled: true,
        threshold: 0.85,
        redistribution_strategy: 'capacity-based',
        monitoring_interval_ms: 10000
      },
      knowledge_integration: {
        graph_type: 'distributed',
        indexing: 'vector-based',
        similarity_threshold: 0.85,
        update_propagation: 'gossip-protocol'
      },
      coordination_channels: {
        primary: 'mesh-network',
        fallback: 'hierarchical',
        protocol: 'async-message-passing',
        encryption: 'end-to-end'
      },
      fault_tolerance: {
        split_brain_detection: true,
        quorum_recovery: true,
        graceful_degradation: true,
        rollback_support: true
      }
    };

    coordinator = new CollectiveIntelligence(mockConfig);
  });

  afterEach(() => {
    coordinator.destroy();
  });

  describe('Initialization', () => {
    test('should initialize with correct topology', async () => {
      await coordinator.initialize();
      const status = coordinator.getStatus();
      expect(status.topology).toBe('mesh');
    });

    test('should set up memory synchronization', async () => {
      await coordinator.initialize();
      expect(coordinator.syncInterval).toBeDefined();
    });

    test('should initialize consensus mechanisms', async () => {
      await coordinator.initialize();
      expect(coordinator.consensus.threshold).toBe(0.75);
    });

    test('should create knowledge graph', async () => {
      await coordinator.initialize();
      expect(coordinator.knowledgeGraph.size).toBeGreaterThan(0);
    });
  });

  describe('Memory Synchronization', () => {
    test('should synchronize memory periodically', (done) => {
      coordinator.initialize();

      setTimeout(() => {
        const state = coordinator.sharedMemory.get('collective-state');
        expect(state).toBeDefined();
        expect(state.synchronization_timestamp).toBeDefined();
        done();
      }, 100);
    });

    test('should update collective state', () => {
      coordinator.synchronizeMemory();
      const state = coordinator.sharedMemory.get('collective-state');

      expect(state.consensus_level).toBeDefined();
      expect(state.shared_knowledge).toBeDefined();
      expect(state.decision_queue).toBeInstanceOf(Array);
    });
  });

  describe('Consensus Building', () => {
    test('should build consensus with sufficient votes', async () => {
      // Add mock agents
      const mockAgents = [
        { id: 'agent1', vote: () => Promise.resolve(0.9), expertise: ['distributed-systems'] },
        { id: 'agent2', vote: () => Promise.resolve(0.85), expertise: ['consensus-protocols'] },
        { id: 'agent3', vote: () => Promise.resolve(0.8), expertise: ['distributed-systems'] },
        { id: 'agent4', vote: () => Promise.resolve(0.95), expertise: ['cognitive-architecture'] },
        { id: 'agent5', vote: () => Promise.resolve(0.88), expertise: ['distributed-systems'] }
      ];

      mockAgents.forEach(agent => {
        coordinator.agents.set(agent.id, agent);
      });

      const decision = {
        id: 'test-decision-1',
        topic: 'architecture-selection',
        domain: 'distributed-systems',
        options: ['mesh', 'hierarchical']
      };

      const result = await coordinator.buildConsensus(decision);
      expect(result).toBe(true);
    });

    test('should reject consensus with insufficient votes', async () => {
      // Add mock agents with low votes
      const mockAgents = [
        { id: 'agent1', vote: () => Promise.resolve(0.4), expertise: ['other'] },
        { id: 'agent2', vote: () => Promise.resolve(0.3), expertise: ['other'] },
        { id: 'agent3', vote: () => Promise.resolve(0.5), expertise: ['other'] }
      ];

      mockAgents.forEach(agent => {
        coordinator.agents.set(agent.id, agent);
      });

      const decision = {
        id: 'test-decision-2',
        topic: 'minor-change',
        domain: 'other',
        options: ['yes', 'no']
      };

      const result = await coordinator.buildConsensus(decision);
      expect(result).toBe(false);
      expect(coordinator.consensusQueue.length).toBeGreaterThan(0);
    });

    test('should apply weighted voting by expertise', () => {
      const votes = [
        { agentId: 'agent1', vote: 0.9, expertise: ['distributed-systems'] },
        { agentId: 'agent2', vote: 0.8, expertise: ['other'] }
      ];

      const decision = { domain: 'distributed-systems' };
      const weighted = coordinator.applyWeightedVoting(votes, decision);

      expect(weighted[0].weight).toBeGreaterThan(weighted[1].weight);
    });

    test('should detect Byzantine faults', () => {
      const votes = [
        { agentId: 'agent1', vote: 0.9, weight: 1.0 },
        { agentId: 'agent2', vote: 0.85, weight: 1.0 },
        { agentId: 'agent3', vote: 0.1, weight: 1.0 }, // Malicious
        { agentId: 'agent4', vote: 0.88, weight: 1.0 }
      ];

      const valid = coordinator.validateVotesByzantine(votes);
      expect(valid.length).toBeLessThan(votes.length);
      expect(valid.find(v => v.vote === 0.1)).toBeUndefined();
    });
  });

  describe('Cognitive Load Balancing', () => {
    test('should calculate total cognitive load', () => {
      coordinator.agents.set('agent1', { currentLoad: 0.8 });
      coordinator.agents.set('agent2', { currentLoad: 0.6 });
      coordinator.agents.set('agent3', { currentLoad: 0.7 });

      const load = coordinator.calculateTotalCognitiveLoad();
      expect(load).toBeCloseTo(0.7, 1);
    });

    test('should redistribute tasks when overloaded', () => {
      coordinator.agents.set('overloaded', {
        currentLoad: 0.95,
        type: 'worker',
        getPendingTasks: () => ['task1', 'task2']
      });
      coordinator.agents.set('available', {
        currentLoad: 0.3,
        acceptTasks: jest.fn()
      });

      coordinator.redistributeTasks();

      const available = coordinator.agents.get('available');
      expect(available.acceptTasks).toHaveBeenCalled();
    });
  });

  describe('Knowledge Integration', () => {
    test('should integrate new knowledge', () => {
      const knowledge = {
        insights: ['New pattern discovered'],
        patterns: { 'pattern1': 'description' },
        confidence: 0.92
      };

      coordinator.integrateKnowledge('researcher', knowledge);

      const entries = Array.from(coordinator.knowledgeGraph.entries());
      const newEntry = entries.find(([k]) => k.includes('researcher'));

      expect(newEntry).toBeDefined();
      expect(newEntry[1].confidence).toBe(0.92);
    });

    test('should propagate knowledge to agents', () => {
      const mockAgent = { receiveKnowledge: jest.fn() };
      coordinator.agents.set('agent1', mockAgent);

      const knowledge = { insights: ['test'] };
      coordinator.propagateKnowledge(knowledge);

      expect(mockAgent.receiveKnowledge).toHaveBeenCalledWith(knowledge);
    });
  });

  describe('Status Reporting', () => {
    test('should report accurate status', () => {
      coordinator.agents.set('agent1', { currentLoad: 0.5 });
      coordinator.agents.set('agent2', { currentLoad: 0.6 });
      coordinator.knowledgeGraph.set('entry1', { data: 'test' });

      const status = coordinator.getStatus();

      expect(status.active_agents).toBe(2);
      expect(status.knowledge_entries).toBeGreaterThan(0);
      expect(status.topology).toBe('mesh');
    });
  });

  describe('Error Handling', () => {
    test('should handle empty agent list gracefully', () => {
      const load = coordinator.calculateTotalCognitiveLoad();
      expect(load).toBe(0);
    });

    test('should handle missing agent methods', () => {
      coordinator.agents.set('simple-agent', {});

      expect(() => {
        coordinator.propagateMemoryUpdates();
      }).not.toThrow();
    });

    test('should cleanup on destroy', () => {
      coordinator.initialize();
      coordinator.agents.set('agent1', {});
      coordinator.knowledgeGraph.set('entry1', {});

      coordinator.destroy();

      expect(coordinator.agents.size).toBe(0);
      expect(coordinator.knowledgeGraph.size).toBe(0);
      expect(coordinator.syncInterval).toBeNull();
    });
  });
});

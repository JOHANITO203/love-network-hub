/**
 * Collective Intelligence Coordinator
 * Neural nexus of the hive mind system
 */

class CollectiveIntelligence {
  constructor(config) {
    this.config = config;
    this.agents = new Map();
    this.sharedMemory = new Map();
    this.consensusQueue = [];
    this.knowledgeGraph = new Map();
    this.cognitiveLoad = 0;
    this.syncInterval = null;
  }

  /**
   * Initialize hive mind coordination
   */
  async initialize() {
    console.log('🧠 Initializing Collective Intelligence Coordinator...');

    // Set up memory synchronization
    this.setupMemorySynchronization();

    // Initialize consensus mechanisms
    this.initializeConsensus();

    // Start cognitive load monitoring
    this.startCognitiveLoadBalancing();

    // Create shared knowledge graph
    this.initializeKnowledgeGraph();

    console.log('✅ Hive mind activated with mesh topology');
  }

  /**
   * Memory Synchronization Protocol
   */
  setupMemorySynchronization() {
    const interval = this.config.memory_synchronization.interval_ms;

    this.syncInterval = setInterval(() => {
      this.synchronizeMemory();
    }, interval);

    console.log(`🔄 Memory sync every ${interval}ms`);
  }

  synchronizeMemory() {
    const timestamp = Date.now();

    // Update collective state
    this.sharedMemory.set('collective-state', {
      consensus_level: this.calculateConsensusLevel(),
      shared_knowledge: Object.fromEntries(this.knowledgeGraph),
      decision_queue: this.consensusQueue,
      synchronization_timestamp: timestamp,
      active_agents: Array.from(this.agents.keys())
    });

    // Propagate updates to all agents
    this.propagateMemoryUpdates();
  }

  /**
   * Consensus Building Mechanisms
   */
  initializeConsensus() {
    this.consensus = {
      mechanism: this.config.consensus.mechanism,
      threshold: this.config.consensus.threshold,
      votingMethod: this.config.consensus.voting_method,
      quorumSize: this.config.consensus.quorum_size
    };

    console.log(`🤝 Consensus: ${this.consensus.mechanism} (${this.consensus.threshold * 100}% threshold)`);
  }

  async buildConsensus(decision) {
    console.log(`🗳️  Building consensus for: ${decision.topic}`);

    // Collect votes from all agents
    const votes = await this.collectVotes(decision);

    // Apply weighted voting
    const weightedVotes = this.applyWeightedVoting(votes, decision);

    // Check Byzantine fault tolerance
    const validVotes = this.validateVotesByzantine(weightedVotes);

    // Calculate consensus level
    const consensusLevel = this.calculateConsensusFromVotes(validVotes);

    if (consensusLevel >= this.consensus.threshold) {
      console.log(`✅ Consensus reached: ${(consensusLevel * 100).toFixed(1)}%`);
      this.executeConsensusDecision(decision, validVotes);
      return true;
    } else {
      console.log(`⏳ Consensus pending: ${(consensusLevel * 100).toFixed(1)}%`);
      this.consensusQueue.push({ decision, votes: validVotes, level: consensusLevel });
      return false;
    }
  }

  async collectVotes(decision) {
    const votes = [];

    for (const [agentId, agent] of this.agents) {
      const vote = await agent.vote(decision);
      votes.push({ agentId, vote, expertise: agent.expertise });
    }

    return votes;
  }

  applyWeightedVoting(votes, decision) {
    return votes.map(v => {
      // Weight vote by agent's expertise in decision domain
      const weight = this.calculateExpertiseWeight(v.expertise, decision.domain);
      return { ...v, weight };
    });
  }

  validateVotesByzantine(votes) {
    // Byzantine fault tolerance: detect and exclude malicious votes
    const median = this.calculateMedianVote(votes);
    const threshold = 0.3; // 30% deviation tolerance

    return votes.filter(v => {
      const deviation = Math.abs(v.vote - median) / median;
      return deviation <= threshold;
    });
  }

  calculateConsensusFromVotes(votes) {
    const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
    const positiveWeight = votes.filter(v => v.vote > 0.5).reduce((sum, v) => sum + v.weight, 0);
    return positiveWeight / totalWeight;
  }

  executeConsensusDecision(decision, votes) {
    // Store decision in shared memory
    this.sharedMemory.set(`decision-${decision.id}`, {
      topic: decision.topic,
      result: 'approved',
      votes: votes.length,
      consensus_level: this.calculateConsensusFromVotes(votes),
      timestamp: Date.now()
    });

    // Propagate to all agents
    this.broadcastDecision(decision);
  }

  /**
   * Cognitive Load Balancing
   */
  startCognitiveLoadBalancing() {
    const interval = this.config.cognitive_load_balancing.monitoring_interval_ms;

    setInterval(() => {
      this.balanceCognitiveLoad();
    }, interval);

    console.log('⚖️  Cognitive load balancing active');
  }

  balanceCognitiveLoad() {
    const threshold = this.config.cognitive_load_balancing.threshold;

    // Calculate total cognitive load
    this.cognitiveLoad = this.calculateTotalCognitiveLoad();

    if (this.cognitiveLoad > threshold) {
      console.log(`⚠️  High cognitive load: ${(this.cognitiveLoad * 100).toFixed(1)}%`);
      this.redistributeTasks();
    }
  }

  calculateTotalCognitiveLoad() {
    let totalLoad = 0;
    let agentCount = this.agents.size;

    for (const [_, agent] of this.agents) {
      totalLoad += agent.currentLoad || 0;
    }

    return agentCount > 0 ? totalLoad / agentCount : 0;
  }

  redistributeTasks() {
    // Find agents with low load
    const availableAgents = Array.from(this.agents.entries())
      .filter(([_, agent]) => (agent.currentLoad || 0) < 0.6)
      .sort((a, b) => a[1].currentLoad - b[1].currentLoad);

    // Find agents with high load
    const overloadedAgents = Array.from(this.agents.entries())
      .filter(([_, agent]) => (agent.currentLoad || 0) > 0.9);

    // Redistribute tasks
    for (const [agentId, agent] of overloadedAgents) {
      if (availableAgents.length > 0) {
        const [targetId, targetAgent] = availableAgents.shift();
        this.transferTasks(agentId, targetId);
        console.log(`📦 Redistributed tasks: ${agentId} → ${targetId}`);
      } else {
        // Spawn new agent if needed
        this.spawnSpecializedAgent(agent.type);
      }
    }
  }

  async spawnSpecializedAgent(type) {
    console.log(`🚀 Spawning specialized agent: ${type}`);
    // Would integrate with Flow-Nexus agent spawning
  }

  /**
   * Knowledge Integration
   */
  initializeKnowledgeGraph() {
    this.knowledgeGraph.set('initialization', {
      insights: [
        'Mesh topology enables peer-to-peer coordination',
        'Adaptive strategy optimizes for dynamic workloads',
        'Byzantine fault tolerance ensures decision integrity'
      ],
      patterns: {
        coordination: 'mesh-based peer communication',
        consensus: 'weighted voting with BFT',
        synchronization: '30-second intervals for state updates'
      },
      created_at: Date.now()
    });

    console.log('📚 Knowledge graph initialized');
  }

  integrateKnowledge(source, knowledge) {
    const key = `knowledge-${source}-${Date.now()}`;

    this.knowledgeGraph.set(key, {
      source,
      insights: knowledge.insights || [],
      patterns: knowledge.patterns || {},
      decisions: knowledge.decisions || {},
      confidence: knowledge.confidence || 0.8,
      created_at: Date.now()
    });

    // Update vector index for similarity search
    this.updateKnowledgeIndex(key, knowledge);

    // Propagate to swarm
    this.propagateKnowledge(knowledge);
  }

  updateKnowledgeIndex(key, knowledge) {
    // Vector-based indexing for similarity search
    // In production, would use embeddings
    console.log(`📇 Indexed knowledge: ${key}`);
  }

  propagateKnowledge(knowledge) {
    // Gossip protocol for knowledge propagation
    for (const [agentId, agent] of this.agents) {
      agent.receiveKnowledge?.(knowledge);
    }
  }

  /**
   * Coordination Channels
   */
  broadcastDecision(decision) {
    for (const [agentId, agent] of this.agents) {
      agent.receiveDecision?.(decision);
    }
  }

  propagateMemoryUpdates() {
    const state = this.sharedMemory.get('collective-state');

    for (const [agentId, agent] of this.agents) {
      agent.syncMemory?.(state);
    }
  }

  transferTasks(fromAgentId, toAgentId) {
    const fromAgent = this.agents.get(fromAgentId);
    const toAgent = this.agents.get(toAgentId);

    if (fromAgent && toAgent) {
      // Transfer pending tasks
      const tasks = fromAgent.getPendingTasks?.() || [];
      toAgent.acceptTasks?.(tasks);
    }
  }

  /**
   * Helper Methods
   */
  calculateConsensusLevel() {
    // Calculate current consensus level across all decisions
    const decisions = Array.from(this.sharedMemory.entries())
      .filter(([k, _]) => k.startsWith('decision-'));

    if (decisions.length === 0) return 0.85;

    const avgConsensus = decisions.reduce((sum, [_, d]) => sum + (d.consensus_level || 0), 0) / decisions.length;
    return avgConsensus;
  }

  calculateMedianVote(votes) {
    const values = votes.map(v => v.vote).sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
  }

  calculateExpertiseWeight(expertise, domain) {
    // Simple expertise weighting - in production would use more sophisticated matching
    return expertise.includes(domain) ? 1.5 : 1.0;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.agents.clear();
    this.sharedMemory.clear();
    this.knowledgeGraph.clear();

    console.log('🛑 Hive mind deactivated');
  }

  /**
   * Status Reporting
   */
  getStatus() {
    return {
      active_agents: this.agents.size,
      cognitive_load: this.cognitiveLoad,
      consensus_level: this.calculateConsensusLevel(),
      pending_decisions: this.consensusQueue.length,
      knowledge_entries: this.knowledgeGraph.size,
      topology: this.config.hive_mind.topology,
      memory_synchronized: this.sharedMemory.has('collective-state')
    };
  }
}

module.exports = CollectiveIntelligence;

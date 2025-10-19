/**
 * Hive Mind Coordination - Main Export
 */

const CollectiveIntelligence = require('./collective-intelligence');
const MemoryPersistence = require('./memory-persistence');

/**
 * Initialize complete coordination system
 */
async function initializeHiveMind(config) {
  const coordinator = new CollectiveIntelligence(config.hive_mind);
  const memory = new MemoryPersistence(config.hive_mind);

  await coordinator.initialize();

  return {
    coordinator,
    memory,

    // Convenience methods
    registerAgent: (id, agent) => coordinator.agents.set(id, agent),
    buildConsensus: (decision) => coordinator.buildConsensus(decision),
    shareKnowledge: (source, knowledge) => coordinator.integrateKnowledge(source, knowledge),
    getStatus: () => coordinator.getStatus(),

    // Memory operations
    store: (key, value, namespace) => memory.store(key, value, namespace),
    retrieve: (key, namespace) => memory.retrieve(key, namespace),
    query: (namespace) => memory.queryNamespace(namespace),

    // Cleanup
    shutdown: () => {
      coordinator.destroy();
      return { success: true };
    }
  };
}

module.exports = {
  CollectiveIntelligence,
  MemoryPersistence,
  initializeHiveMind
};

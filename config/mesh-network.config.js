/**
 * Mesh Network Configuration
 * Default settings for mesh topology and coordination
 */

export const meshNetworkConfig = {
  // Network Configuration
  network: {
    maxPeers: 5,
    heartbeatInterval: 3000,
    heartbeatTimeout: 10000,
    messageTimeout: 5000,
    reconnectDelay: 2000,
    maxReconnectAttempts: 5
  },

  // Gossip Protocol
  gossip: {
    enabled: true,
    fanout: 3,
    interval: 2000,
    maxGossipRounds: 10,
    antiEntropyInterval: 5000
  },

  // Consensus Configuration
  consensus: {
    algorithm: 'pbft', // 'pbft', 'raft', or 'gossip'
    threshold: 0.67,   // Byzantine fault tolerance (2f+1)
    timeoutMs: 5000,
    viewChangeTimeout: 10000,
    enableCryptographicSigning: false
  },

  // Heartbeat Monitoring
  heartbeat: {
    enabled: true,
    interval: 3000,
    timeout: 10000,
    confirmationQuorum: 2,
    failureRetryAttempts: 3
  },

  // Distributed Hash Table
  dht: {
    enabled: true,
    virtualNodes: 150,
    replicationFactor: 3,
    redistributionDelay: 1000
  },

  // Fault Tolerance
  faultTolerance: {
    autoHeal: true,
    partitionDetectionInterval: 5000,
    failoverStrategy: 'automatic',
    maxFailedPeersBeforePartition: 0.5
  },

  // Performance
  performance: {
    messageBatching: true,
    batchSize: 10,
    batchTimeout: 100,
    enableCompression: false,
    maxConcurrentMessages: 100
  },

  // Security
  security: {
    enableEncryption: false,
    enableAuthentication: false,
    allowedPeers: [], // Empty = allow all
    blockedPeers: []
  },

  // Monitoring
  monitoring: {
    enableMetrics: true,
    metricsInterval: 5000,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    enableTracing: false
  }
};

/**
 * Environment-specific overrides
 */
export const developmentConfig = {
  ...meshNetworkConfig,
  network: {
    ...meshNetworkConfig.network,
    maxPeers: 3,
    heartbeatInterval: 2000
  },
  monitoring: {
    ...meshNetworkConfig.monitoring,
    logLevel: 'debug',
    enableTracing: true
  }
};

export const productionConfig = {
  ...meshNetworkConfig,
  network: {
    ...meshNetworkConfig.network,
    maxPeers: 10,
    heartbeatInterval: 5000
  },
  security: {
    ...meshNetworkConfig.security,
    enableEncryption: true,
    enableAuthentication: true
  },
  performance: {
    ...meshNetworkConfig.performance,
    enableCompression: true
  },
  monitoring: {
    ...meshNetworkConfig.monitoring,
    logLevel: 'warn'
  }
};

/**
 * Get configuration based on environment
 */
export function getConfig(environment = 'development') {
  switch (environment) {
    case 'production':
      return productionConfig;
    case 'development':
    default:
      return developmentConfig;
  }
}

/**
 * Distributed Memory Manager Demo
 * Demonstrates full capabilities of the hive mind memory system
 */

const { initializeMemorySystem } = require('../src/memory');

async function runDemo() {
  console.log('=== Distributed Memory Manager Demo ===\n');

  // 1. Initialize the memory system
  console.log('1. Initializing memory system...');
  const system = await initializeMemorySystem({
    swarmId: 'demo-hive',
    storagePath: '.demo-memory',
    l1MaxSize: 10,
    l2MaxSize: 50,
    syncInterval: 5000
  });
  console.log('   Memory system initialized!\n');

  // 2. Register agents
  console.log('2. Registering agents...');
  await system.hiveMind.registerAgent('coder-1', {
    type: 'coder',
    capabilities: ['javascript', 'testing', 'architecture']
  });

  await system.hiveMind.registerAgent('researcher-1', {
    type: 'researcher',
    capabilities: ['analysis', 'documentation', 'planning']
  });

  await system.hiveMind.registerAgent('reviewer-1', {
    type: 'reviewer',
    capabilities: ['code-review', 'security', 'performance']
  });
  console.log('   3 agents registered\n');

  // 3. Store data with different priorities
  console.log('3. Storing data with different priorities...');

  await system.store('config/critical-setting', {
    apiEndpoint: 'https://api.example.com',
    timeout: 5000
  }, 'critical');
  console.log('   Stored critical config (L1 cache)');

  await system.store('tasks/current', {
    taskId: 'task-123',
    description: 'Implement authentication',
    assignedTo: 'coder-1',
    status: 'in_progress'
  }, 'high');
  console.log('   Stored active task (L1 cache)');

  await system.store('knowledge/best-practices', {
    topic: 'API Design',
    practices: [
      'Use RESTful conventions',
      'Version your APIs',
      'Implement proper error handling'
    ]
  }, 'normal');
  console.log('   Stored knowledge (L2 cache)');

  await system.store('logs/historical', {
    date: '2025-10-05',
    events: ['System started', 'Agents registered']
  }, 'low');
  console.log('   Stored historical logs (L3 cache)\n');

  // 4. Retrieve data (demonstrating cache hits)
  console.log('4. Retrieving data (cache performance)...');

  const config = await system.retrieve('config/critical-setting');
  console.log(`   Retrieved critical config from ${config.source} cache`);
  console.log(`   Value: ${JSON.stringify(config.value, null, 2)}`);

  const task = await system.retrieve('tasks/current');
  console.log(`   Retrieved task from ${task.source} cache`);

  const knowledge = await system.retrieve('knowledge/best-practices');
  console.log(`   Retrieved knowledge from ${knowledge.source} cache\n`);

  // 5. Share knowledge between agents
  console.log('5. Sharing knowledge between agents...');

  await system.hiveMind.shareKnowledge('researcher-1', {
    topic: 'Performance Optimization',
    insights: [
      'Use caching for frequently accessed data',
      'Implement lazy loading',
      'Optimize database queries'
    ],
    confidence: 0.9
  });
  console.log('   Knowledge shared by researcher-1\n');

  // 6. Batch operations
  console.log('6. Demonstrating batch operations...');

  const batchData = [
    { key: 'metrics/cpu', value: { usage: 45.2, timestamp: Date.now() }, options: {} },
    { key: 'metrics/memory', value: { usage: 512, timestamp: Date.now() }, options: {} },
    { key: 'metrics/requests', value: { count: 1250, timestamp: Date.now() }, options: {} }
  ];

  await system.memoryManager.batchStore(batchData);
  console.log('   Stored 3 metrics in batch\n');

  const batchResults = await system.memoryManager.batchRetrieve([
    { key: 'metrics/cpu', options: {} },
    { key: 'metrics/memory', options: {} },
    { key: 'metrics/requests', options: {} }
  ]);
  console.log('   Retrieved 3 metrics in batch');
  console.log(`   CPU: ${batchResults['metrics/cpu'].value.usage}%`);
  console.log(`   Memory: ${batchResults['metrics/memory'].value.usage}MB`);
  console.log(`   Requests: ${batchResults['metrics/requests'].value.count}\n`);

  // 7. Demonstrate CRDT conflict resolution
  console.log('7. Demonstrating CRDT conflict resolution...');

  // Simulate concurrent updates
  const conflictKey = 'shared/counter';
  system.memoryManager.vectorClock.set('node-1', 5);
  await system.store(conflictKey, { count: 100 });

  system.memoryManager.vectorClock.set('node-2', 5);
  await system.store(conflictKey, { count: 105 });

  const resolved = await system.retrieve(conflictKey);
  console.log(`   Conflict resolved: ${JSON.stringify(resolved.value)}\n`);

  // 8. Monitor performance metrics
  console.log('8. Performance metrics...');

  const metrics = await system.getMetrics();
  console.log(`   Operations/sec: ${metrics.memory.operationsPerSecond.toFixed(2)}`);
  console.log(`   Cache hit rate: ${(metrics.memory.cacheHitRate * 100).toFixed(1)}%`);
  console.log(`   Total reads: ${metrics.memory.totalReads}`);
  console.log(`   Total writes: ${metrics.memory.totalWrites}`);
  console.log(`   L1 cache size: ${metrics.memory.l1Size}`);
  console.log(`   L2 cache size: ${metrics.memory.l2Size}`);
  console.log(`   L3 cache size: ${metrics.memory.l3Size}\n`);

  // 9. Get system status
  console.log('9. System status...');

  const status = await system.getStatus();
  console.log(`   Swarm ID: ${status.metadata.swarmId}`);
  console.log(`   Status: ${status.metadata.status}`);
  console.log(`   Topology: ${status.metadata.topology}`);
  console.log(`   Active agents: ${status.agents.length}`);
  console.log(`   Node ID: ${status.nodeId}\n`);

  // 10. Memory index
  console.log('10. Memory index...');

  const index = await system.retrieve('shared/memory-index');
  if (index.found) {
    console.log(`   Registered agents: ${Object.keys(index.value.agents).length}`);
    console.log(`   Shared components: ${Object.keys(index.value.sharedComponents).length}`);
    console.log(`   Last indexed: ${new Date(index.value.lastIndexed).toLocaleString()}\n`);
  }

  // 11. Stress test - many operations
  console.log('11. Stress test (1000 operations)...');

  const startTime = Date.now();
  for (let i = 0; i < 1000; i++) {
    if (i % 2 === 0) {
      await system.store(`test/key-${i}`, `value-${i}`);
    } else {
      await system.retrieve(`test/key-${i - 1}`);
    }
  }
  const duration = Date.now() - startTime;
  const opsPerSec = (1000 / duration) * 1000;
  console.log(`   Completed 1000 operations in ${duration}ms`);
  console.log(`   Throughput: ${opsPerSec.toFixed(0)} ops/sec\n`);

  // 12. Final metrics after stress test
  console.log('12. Final metrics after stress test...');

  const finalMetrics = await system.getMetrics();
  console.log(`   Cache hit rate: ${(finalMetrics.memory.cacheHitRate * 100).toFixed(1)}%`);
  console.log(`   Total operations: ${finalMetrics.memory.totalReads + finalMetrics.memory.totalWrites}`);
  console.log(`   Memory usage: ${finalMetrics.memory.memoryUsageMb.toFixed(2)}MB\n`);

  // 13. Cleanup
  console.log('13. Shutting down...');
  await system.shutdown();
  console.log('   Shutdown complete\n');

  console.log('=== Demo Complete ===');
}

// Run demo
if (require.main === module) {
  runDemo().catch(error => {
    console.error('Demo failed:', error);
    process.exit(1);
  });
}

module.exports = { runDemo };

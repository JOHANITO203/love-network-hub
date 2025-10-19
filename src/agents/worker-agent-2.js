/**
 * Worker Agent #2 - Hive Mind Swarm
 * Specialized executor with collective intelligence integration
 */

const CollectiveIntelligence = require('../coordination/collective-intelligence.js');

class WorkerAgent2 {
  constructor(config = {}) {
    this.id = 'worker-2';
    this.type = 'worker-specialist';
    this.status = 'initializing';
    this.capabilities = [
      'code-implementation',
      'analysis',
      'testing',
      'debugging',
      'optimization'
    ];
    this.currentLoad = 0;
    this.tasksCompleted = 0;
    this.expertise = ['javascript', 'nodejs', 'testing', 'coordination'];
    this.memory = new Map();
    this.hiveConnection = null;
    this.assignedTasks = [];
    this.progressReports = [];
  }

  /**
   * Initialize and connect to hive mind
   */
  async initialize(collectiveIntelligence) {
    console.log('🤖 Worker Agent #2 initializing...');

    this.hiveConnection = collectiveIntelligence;

    // Register with collective intelligence
    if (this.hiveConnection && this.hiveConnection.agents) {
      this.hiveConnection.agents.set(this.id, this);
      console.log('✅ Registered with collective intelligence');
    }

    // Store initial status in memory
    this.updateMemory('status', {
      agent: this.id,
      status: 'ready',
      timestamp: Date.now(),
      capabilities: this.capabilities,
      expertise: this.expertise,
      ready: true,
      cognitive_load: this.currentLoad
    });

    // Report to hive mind
    this.reportStatus('initialized');

    this.status = 'ready';
    console.log(`✅ Worker Agent #2 ready for assignments`);

    return this.getStatus();
  }

  /**
   * Update local memory and sync with hive
   */
  updateMemory(key, value) {
    const memoryKey = `hive-mind/workers/${this.id}/${key}`;
    this.memory.set(memoryKey, {
      value,
      timestamp: Date.now(),
      agent: this.id
    });

    // Propagate to collective intelligence
    if (this.hiveConnection && this.hiveConnection.sharedMemory) {
      this.hiveConnection.sharedMemory.set(memoryKey, value);
    }
  }

  /**
   * Report status to hive mind coordinator
   */
  reportStatus(statusType, details = {}) {
    const statusReport = {
      agent: this.id,
      type: statusType,
      timestamp: Date.now(),
      status: this.status,
      currentLoad: this.currentLoad,
      tasksCompleted: this.tasksCompleted,
      assignedTasks: this.assignedTasks.length,
      ...details
    };

    this.updateMemory('status', statusReport);

    console.log(`📊 Worker #2 Status: ${statusType}`, details);

    return statusReport;
  }

  /**
   * Accept task assignment from coordinator
   */
  async acceptTask(task) {
    console.log(`📥 Worker #2 accepting task: ${task.description || task.id}`);

    this.assignedTasks.push(task);
    this.status = 'task-received';
    this.currentLoad = Math.min(1.0, this.currentLoad + 0.2);

    this.reportStatus('task-received', {
      task_id: task.id,
      estimated_completion: Date.now() + (task.estimatedTime || 3600000),
      dependencies: task.dependencies || []
    });

    return {
      accepted: true,
      agent: this.id,
      task_id: task.id,
      estimated_start: Date.now()
    };
  }

  /**
   * Execute assigned task with progress reporting
   */
  async executeTask(task) {
    console.log(`⚡ Worker #2 executing: ${task.description}`);

    this.status = 'executing';
    this.reportStatus('task-started', { task_id: task.id });

    try {
      // Check dependencies
      if (task.dependencies && task.dependencies.length > 0) {
        const depsReady = await this.checkDependencies(task.dependencies);
        if (!depsReady) {
          this.reportStatus('blocked', {
            task_id: task.id,
            blocked_on: task.dependencies,
            since: Date.now()
          });
          return { success: false, reason: 'dependencies_not_ready' };
        }
      }

      // Execute task steps
      const steps = task.steps || ['analyze', 'implement', 'test', 'validate'];
      const results = [];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        console.log(`  📍 Step ${i + 1}/${steps.length}: ${step}`);

        this.reportProgress(task.id, {
          step: step,
          stepNumber: i + 1,
          totalSteps: steps.length,
          progress: ((i + 1) / steps.length) * 100
        });

        // Execute step (placeholder - actual implementation would be task-specific)
        const stepResult = await this.executeStep(step, task);
        results.push(stepResult);

        // Update cognitive load
        this.currentLoad = Math.min(1.0, 0.3 + (i / steps.length) * 0.5);
      }

      // Task complete
      this.status = 'ready';
      this.currentLoad = Math.max(0, this.currentLoad - 0.2);
      this.tasksCompleted++;

      const completionReport = {
        success: true,
        task_id: task.id,
        results: results,
        time_taken_ms: Date.now() - task.startTime,
        resources_used: {
          memory_mb: Math.floor(Math.random() * 256),
          cpu_percentage: Math.floor(this.currentLoad * 100)
        }
      };

      this.reportStatus('task-complete', completionReport);

      // Remove from assigned tasks
      this.assignedTasks = this.assignedTasks.filter(t => t.id !== task.id);

      return completionReport;

    } catch (error) {
      console.error(`❌ Worker #2 task failed:`, error.message);

      this.reportStatus('task-failed', {
        task_id: task.id,
        error: error.message,
        timestamp: Date.now()
      });

      this.status = 'ready';
      this.currentLoad = Math.max(0, this.currentLoad - 0.2);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Execute individual task step
   */
  async executeStep(stepName, task) {
    // Simulate work with actual implementation hooks
    await this.simulateWork(500, 1500);

    return {
      step: stepName,
      status: 'complete',
      timestamp: Date.now(),
      output: `${stepName} completed for ${task.description}`
    };
  }

  /**
   * Report task progress
   */
  reportProgress(taskId, progress) {
    const progressReport = {
      agent: this.id,
      task_id: taskId,
      ...progress,
      timestamp: Date.now()
    };

    this.progressReports.push(progressReport);
    this.updateMemory('progress', progressReport);

    console.log(`  📈 Progress: ${progress.progress?.toFixed(1) || 'N/A'}%`);
  }

  /**
   * Check if task dependencies are ready
   */
  async checkDependencies(dependencies) {
    if (!this.hiveConnection || !this.hiveConnection.sharedMemory) {
      return true; // No hive connection, assume ready
    }

    for (const dep of dependencies) {
      const depStatus = this.hiveConnection.sharedMemory.get(`dependency-${dep}`);
      if (!depStatus || !depStatus.ready) {
        return false;
      }
    }

    return true;
  }

  /**
   * Receive knowledge from collective intelligence
   */
  receiveKnowledge(knowledge) {
    console.log(`📚 Worker #2 received knowledge: ${knowledge.insights?.length || 0} insights`);

    this.updateMemory('knowledge-received', {
      source: knowledge.source,
      insights_count: knowledge.insights?.length || 0,
      timestamp: Date.now()
    });
  }

  /**
   * Receive consensus decision from hive
   */
  receiveDecision(decision) {
    console.log(`🗳️  Worker #2 received decision: ${decision.topic}`);

    this.updateMemory('decision-received', {
      topic: decision.topic,
      result: decision.result,
      timestamp: Date.now()
    });
  }

  /**
   * Sync memory with collective state
   */
  syncMemory(collectiveState) {
    this.updateMemory('collective-sync', {
      consensus_level: collectiveState.consensus_level,
      active_agents: collectiveState.active_agents,
      sync_timestamp: collectiveState.synchronization_timestamp
    });
  }

  /**
   * Vote on consensus decision
   */
  async vote(decision) {
    // Calculate vote based on expertise and decision domain
    const hasExpertise = this.expertise.some(e =>
      decision.domain?.toLowerCase().includes(e.toLowerCase())
    );

    const vote = hasExpertise ? 0.85 : 0.6;

    console.log(`🗳️  Worker #2 voting: ${vote} on ${decision.topic}`);

    return vote;
  }

  /**
   * Get pending tasks
   */
  getPendingTasks() {
    return this.assignedTasks;
  }

  /**
   * Accept transferred tasks from another agent
   */
  acceptTasks(tasks) {
    console.log(`📦 Worker #2 accepting ${tasks.length} transferred tasks`);

    this.assignedTasks.push(...tasks);
    this.currentLoad = Math.min(1.0, this.currentLoad + (tasks.length * 0.1));

    this.reportStatus('tasks-transferred', {
      tasks_received: tasks.length,
      new_load: this.currentLoad
    });
  }

  /**
   * Get current agent status
   */
  getStatus() {
    return {
      agent: this.id,
      type: this.type,
      status: this.status,
      capabilities: this.capabilities,
      expertise: this.expertise,
      currentLoad: this.currentLoad,
      tasksCompleted: this.tasksCompleted,
      assignedTasks: this.assignedTasks.length,
      ready: this.status === 'ready',
      timestamp: Date.now(),
      memory_entries: this.memory.size,
      hive_connected: !!this.hiveConnection
    };
  }

  /**
   * Simulate work for realistic timing
   */
  async simulateWork(minMs, maxMs) {
    const duration = minMs + Math.random() * (maxMs - minMs);
    await new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * Cleanup and disconnect
   */
  async shutdown() {
    console.log('🛑 Worker Agent #2 shutting down...');

    // Unregister from hive
    if (this.hiveConnection && this.hiveConnection.agents) {
      this.hiveConnection.agents.delete(this.id);
    }

    this.reportStatus('shutdown', {
      final_tasks_completed: this.tasksCompleted,
      uptime_ms: Date.now() - this.initTimestamp
    });

    this.status = 'offline';
    this.memory.clear();
    this.assignedTasks = [];

    console.log('✅ Worker Agent #2 shutdown complete');
  }
}

module.exports = WorkerAgent2;

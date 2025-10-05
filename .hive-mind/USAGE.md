# Hive Mind Usage Guide

## Quick Start

### Using Claude Code Task Tool (Recommended)
The primary way to spawn agents is through Claude Code's Task tool:

```javascript
// Spawn multiple agents in parallel
Task("Backend Developer", "Build REST API with Express", "backend-dev")
Task("Frontend Developer", "Create React UI", "coder")
Task("Test Engineer", "Write comprehensive tests", "tester")
```

### Agent Types Available
- `coder` - General-purpose coding
- `backend-dev` - Backend API development
- `researcher` - Research and analysis
- `tester` - Test creation and validation
- `reviewer` - Code review and quality
- `architect` - System architecture design
- `mobile-dev` - React Native mobile development
- `ml-developer` - Machine learning models
- `cicd-engineer` - CI/CD pipelines

### Coordination Patterns

**Hierarchical (Current)**
- Central queen coordinator
- Specialized worker delegation
- Strategic decision making

**Mesh (Peer-to-Peer)**
- Distributed decision making
- Fault tolerance
- Equal agent collaboration

**Adaptive**
- Dynamic topology switching
- Self-organizing patterns
- Real-time optimization

## Example Workflows

### Full-Stack Development
```javascript
[Single Message]:
  Task("Backend", "Build API with auth", "backend-dev")
  Task("Frontend", "Create React UI", "coder")
  Task("Database", "Design schema", "architect")
  Task("Tests", "Write test suite", "tester")
  Task("DevOps", "Setup Docker/CI", "cicd-engineer")
```

### Code Review + Refactoring
```javascript
[Single Message]:
  Task("Analyzer", "Analyze code quality", "code-analyzer")
  Task("Reviewer", "Review security", "reviewer")
  Task("Refactorer", "Optimize performance", "coder")
```

## Memory System

### Shared Memory
Agents can share data via the memory system:
- Cross-agent communication
- Knowledge persistence
- Pattern learning

### Session Tracking
- Auto-save every 30 seconds
- Session restoration
- Metric collection

## Best Practices

1. **Batch Operations**: Always spawn all agents in ONE message
2. **Clear Instructions**: Give each agent specific, detailed tasks
3. **Coordination**: Agents automatically coordinate via hooks
4. **Memory**: Use memory for sharing decisions and context

## Advanced Features

### Neural Pattern Learning
The system learns from successful patterns and optimizes future tasks.

### Performance Metrics
Track agent performance, token usage, and success rates in `.claude-flow/metrics/`

### Auto-Spawning
The system can automatically spawn agents based on task complexity.

## Monitoring

Check system status:
```bash
# View metrics
cat .claude-flow/metrics/agent-metrics.json

# View memory
cat .hive-mind/memory.json

# View configuration
cat .hive-mind/config.json
```

## Troubleshooting

**Issue**: Agents not coordinating
**Solution**: Ensure all agents are spawned in a single message

**Issue**: Memory not persisting
**Solution**: Check `.hive-mind/memory.json` and session files

**Issue**: Performance degradation
**Solution**: Review `.claude-flow/metrics/performance.json` for bottlenecks

# Hive Mind System

## Overview
This directory contains the Hive Mind coordination system for multi-agent orchestration.

## Structure
- `config.json` - Main Hive Mind configuration
- `config/queens.json` - Queen (coordinator) agent configuration
- `config/workers.json` - Worker agent specializations
- `memory.json` - Distributed memory and knowledge base
- `sessions/` - Session tracking and auto-save files
- `hive.db` - SQLite database for persistent storage (auto-generated)

## Topology
Current topology: **Hierarchical**
- Central queen coordinator
- Specialized worker agents
- Strategic decision making
- Dynamic resource allocation

## Usage
The Hive Mind system is automatically initialized when using Claude Flow swarm features.

To manually reinitialize:
```bash
npx claude-flow@alpha hive-mind init --topology hierarchical
```

## Memory Persistence
- Auto-save enabled: Every 30 seconds
- Cross-session memory: Enabled
- Neural pattern learning: Enabled

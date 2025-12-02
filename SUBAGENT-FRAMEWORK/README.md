# Practical Subagent Framework for Claude Code

## Overview

This framework is based on AI Oriented Dev's proven approach to building applications with Claude Code subagents. Instead of using 40-50 subagents impractically, this focuses on a streamlined, production-ready methodology.

## Core Principles

### 1. **Orchestrator-Centered Architecture**
- **One Orchestrator Agent**: Primary coordinator for all subagents
- **Separated Phases**: Research/Design → Implementation
- **File-Based Memory**: All outputs written to filesystem for persistence
- **Coordinated Execution**: Run subagents in parallel when outputs don't conflict, sequential when dependencies exist

### 2. **Two-Phase Development Process**

#### Phase 1: Design & Planning
- All subagents run in parallel
- Each writes to designated output locations
- Orchestrator validates and synthesizes results
- No conflicts due to separate file outputs

#### Phase 2: Implementation
- **Parallel execution when appropriate**: Multiple subagents can run simultaneously if outputs are coordinated
- **Sequential for dependencies**: Only when one agent needs another's output
- **Orchestrator manages coordination**: Ensures proper file locations and dependencies

## Quick Start

1. **Create PRD using optimized prompt approach** (see `/templates/prd-creation.md`)
2. **Run Design Phase**: `claude --dangerously-skip-permissions design app [prd-file]`
3. **Run Implementation Phase**: `claude --dangerously-skip-permissions implement app [design-folder] [target-folder]`

## Directory Structure

```
SUBAGENT-FRAMEWORK/
├── agents/
│   ├── orchestrator/          # Main coordination agents
│   ├── research/              # Design & planning subagents
│   └── implementation/        # Build & deploy subagents
├── commands/                  # Custom Claude Code commands
├── templates/                 # Agent prompt templates
├── design-outputs/            # Generated design specifications
└── examples/                  # Example projects and workflows
```

## Key Innovation: Parallel Implementation

Unlike the original approach that suggested sequential implementation, this framework enables:

- **Parallel Frontend & Backend Development**: When components are independent
- **Simultaneous API Integration**: Multiple external services can be integrated in parallel
- **Concurrent Testing**: Unit tests, integration tests, and e2e tests can be developed simultaneously
- **Orchestrator Coordination**: Manages dependencies and ensures proper integration

The key is proper **output coordination** and **dependency management** by the orchestrator.

See full documentation in the main README.md file above.

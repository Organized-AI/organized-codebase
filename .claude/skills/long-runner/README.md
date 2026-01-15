# Long-Runner Skill

> Orchestrate long-running agent sessions across multiple context windows

Based on [Anthropic's research on effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

## Overview

The Long-Runner skill enables AI agents to work on complex projects that span multiple sessions. It solves the fundamental challenge of context loss between sessions by implementing structured protocols for initialization, session management, and handoffs.

## The Problem

When agents work across multiple context windows, they face critical challenges:

| Problem | Impact |
|---------|--------|
| **One-shotting** | Agent tries to do too much, runs out of context mid-feature |
| **Premature completion** | Agent declares victory with work incomplete |
| **Broken handoffs** | Next session finds undocumented bugs |
| **Insufficient testing** | Features marked done without E2E verification |

## The Solution

A structured two-agent approach:

1. **Initializer Agent** - Sets up project infrastructure on first run
2. **Coding Agent** - Makes incremental progress per session

Key principle: **One feature at a time, always leave code merge-ready.**

## Quick Start

### Initialize a New Project

```bash
/init-long-runner "Build a real-time chat application"
```

This creates:
- `feature_list.json` - Comprehensive feature tracking (200+ features for complex apps)
- `claude-progress.txt` - Session progress log
- `init.sh` - Development environment setup
- `.claude/long-runner-config.json` - Configuration

### Continue a Project

```bash
# At the start of each session
/session-start

# Work on features...

# Before ending
/session-handoff
```

## Key Protocols

### Session Start Protocol
1. `pwd` - Confirm working directory
2. Read `claude-progress.txt` - Get context from last session
3. Read `feature_list.json` - Check feature status
4. `git log --oneline -20` - Review recent history
5. Run `./init.sh` - Start dev environment
6. Health check - Verify system is working
7. Select feature - Choose highest priority incomplete feature

### Session End Protocol
1. Code cleanup - Remove debug statements
2. Run tests - Ensure all tests pass
3. Update progress - Document what was done
4. Update features - Mark completed features
5. Git commit - Descriptive commit message
6. Handoff notes - Clear instructions for next session

### Checkpoint Protocol

| Context % | Level | Action |
|-----------|-------|--------|
| 70% | Soft | Save progress, evaluate if current feature can complete |
| 85% | Hard | Stop new work, complete current task, full end protocol |
| 95% | Emergency | Force save, immediate session end |

## Commands

| Command | Description |
|---------|-------------|
| `/init-long-runner` | Initialize new project |
| `/feature-status` | Display completion status |
| `/session-start` | Execute start protocol |
| `/session-handoff` | Execute end protocol |
| `/checkpoint` | Save progress mid-session |
| `/next-feature` | Show recommended next feature |

## Best Practices

### Do ✅
- Work on ONE feature at a time
- Test E2E before marking complete
- Commit after each feature
- Update progress file every session
- Leave code merge-ready always

### Don't ❌
- Try to implement multiple features at once
- Mark features complete without testing
- Leave debug code in commits
- End session with uncommitted work
- Skip the session end protocol

## Credits

Based on research by Anthropic Engineering:
[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

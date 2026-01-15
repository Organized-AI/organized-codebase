---
name: long-runner
description: |
  Orchestrate long-running agent sessions across multiple context windows.
  Use when building complex applications that require multiple sessions,
  when handing off work between sessions, or when initializing a new
  long-running project.
metadata:
  version: 1.0.0
  source: Anthropic Engineering Research
  dependencies: git, jq, bash
  integrates_with: weekly-planner, cc-session-manager, memory-mcp, github-mcp
triggers:
  - "start long-running project"
  - "continue project"
  - "session handoff"
  - "check feature status"
  - "initialize project"
  - "multi-session development"
---

# Long-Runner Skill

Orchestrates long-running agent sessions across multiple context windows based on Anthropic's research on effective harnesses for long-running agents.

## ⚠️ CRITICAL BEHAVIOR REQUIREMENTS ⚠️

**NEVER try to complete an entire complex project in one session.**
**ALWAYS work on ONE feature at a time.**
**NEVER mark a feature as complete without E2E testing.**
**ALWAYS leave code in merge-ready state before ending session.**
**ALWAYS update progress files before session ends.**

---

## When to Use This Skill

Claude should use this skill when:
- User describes a complex project requiring multiple sessions
- User wants to continue work from a previous session
- User asks about project/feature status
- A session is approaching context limits
- User mentions "handoff", "continue", or "pick up where we left off"
- Building applications with 50+ features

---

## Core Concepts

### The Problem
Agents working across multiple context windows face:
1. **One-shotting**: Trying to do too much, running out of context mid-feature
2. **Premature completion**: Declaring victory with work incomplete
3. **Broken handoffs**: Next session finds undocumented bugs
4. **Insufficient testing**: Features marked done without E2E verification

### The Solution
A two-agent approach:
1. **Initializer Agent**: Sets up environment on first run
2. **Coding Agent**: Makes incremental progress per session

### Key Artifacts
```
project/
├── init.sh                 # Development server setup
├── claude-progress.txt     # Session progress log
├── feature_list.json       # All features with pass/fail status
├── .claude/
│   └── long-runner-config.json
└── .git/                   # Descriptive commit history
```

---

## Protocol 1: Project Initialization

When starting a NEW long-running project:

### Step 1: Create Feature List
```bash
# Parse user requirements into comprehensive feature list
# Use JSON format (more stable than Markdown)
# Mark ALL features as "passes": false initially
# For complex apps, aim for 200+ features
```

**CRITICAL**: It is unacceptable to remove or edit tests from the feature list because this could lead to missing or buggy functionality.

### Step 2: Create init.sh
```bash
#!/bin/bash
# init.sh - Development environment setup

# Install dependencies
npm install  # or pip install, etc.

# Start development server
npm run dev &

# Wait for server
sleep 5

# Run sanity check
curl -s http://localhost:3000/health || exit 1

echo "Environment ready"
```

### Step 3: Create Progress File
```
=== CLAUDE PROGRESS LOG ===
Project: [project-name]
Initialized: [timestamp]
Total Features: [count]
Completed: 0

=== SESSION LOG ===
[Sessions will be appended here]
```

### Step 4: Initial Git Commit
```bash
git add .
git commit -m "init: Set up long-running project infrastructure

- Created feature_list.json with [X] features
- Created init.sh for dev environment
- Created claude-progress.txt for session tracking
- Ready for incremental development"
```

---

## Protocol 2: Session Start

Every session MUST begin with this checklist:

### Step 1: Orientation
```bash
# 1. Confirm working directory
pwd

# 2. Read progress file
cat claude-progress.txt | tail -50

# 3. Read feature list
cat feature_list.json | jq '.completed, .in_progress'

# 4. Check recent history
git log --oneline -20
```

### Step 2: Health Check
```bash
# 1. Run init script
./init.sh

# 2. Verify basic functionality works
# (Run quick E2E test or curl health endpoint)

# 3. If broken state detected, FIX BEFORE CONTINUING
```

### Step 3: Feature Selection
```json
// Select highest priority incomplete feature
// Priority order:
// 1. Features marked "in_progress" (incomplete from last session)
// 2. Highest priority "passes": false features
// 3. Related features that share code
```

---

## Protocol 3: Session Work

### Golden Rules for Feature Work

1. **ONE feature at a time**
   - Complete feature fully before moving to next
   - If feature is too large, break into sub-features

2. **Test as you go**
   - Write test before or alongside implementation
   - Run E2E test before marking complete
   - Use browser automation when applicable

3. **Keep code clean**
   - No debug console.log statements
   - No commented-out code
   - No half-implemented features

4. **Commit frequently**
   - Commit after each feature completion
   - Use descriptive commit messages
   - Reference feature ID in commit

### Feature Completion Checklist
```markdown
- [ ] Feature implemented per specification
- [ ] Unit tests passing
- [ ] E2E test passing (if applicable)
- [ ] No debug code left
- [ ] Code would be acceptable for merge to main
- [ ] feature_list.json updated: "passes": true
- [ ] Git commit with feature ID
```

---

## Protocol 4: Session End

Before ending ANY session, complete this checklist:

### Step 1: Code Cleanup
```bash
# Remove debug statements
grep -r "console.log" src/ | grep -v node_modules
grep -r "print(" src/ | grep -v __pycache__

# Ensure all tests pass
npm test  # or pytest, etc.

# Check for uncommitted changes
git status
```

### Step 2: Update Progress File
```
=== SESSION: [timestamp] ===
Duration: ~[X] minutes
Token usage: ~[X]% of context

Features worked on:
- feat-023: Completed ✓
- feat-024: In progress (70% complete)

Blockers:
- [any blockers for next session]

Next session should:
- Continue feat-024 (implement error handling)
- Then proceed to feat-025

Code is in merge-ready state: YES
Tests passing: YES
```

### Step 3: Update Feature List
```bash
# Update feature status in JSON
jq '.features |= map(
  if .id == "feat-023" then .passes = true | .last_tested = "[timestamp]"
  else . end
)' feature_list.json > tmp.json && mv tmp.json feature_list.json
```

### Step 4: Git Commit
```bash
git add .
git commit -m "session: Complete feat-023, progress on feat-024

Completed:
- feat-023: User authentication flow

In Progress:
- feat-024: Password reset (70%)

Next: Finish error handling for password reset

All tests passing. Code is merge-ready."
```

---

## Checkpoint Protocol

### Context Thresholds

| Threshold | Action |
|-----------|--------|
| 70% | Soft checkpoint - save progress, can continue |
| 85% | Hard checkpoint - commit, prepare for handoff |
| 95% | Emergency save - force end session immediately |

---

## Integration Points

### With Weekly Planner
- Schedule dedicated long-runner session blocks
- Map feature work to energy levels

### With CC Session Manager
- Token budget allocation: 5% start, 80% work, 15% end
- Automatic checkpoint triggers

### With GitHub MCP
- Auto-commit on session end
- Create PR for completed feature batches

---

## Quick Reference

```
SESSION START:
pwd → progress → features → git log → init.sh → health check → select feature

SESSION WORK:
one feature → implement → test E2E → mark complete → commit → repeat

SESSION END:
cleanup → progress update → feature update → commit → handoff notes
```

---

**Source:** Anthropic Engineering - Effective harnesses for long-running agents

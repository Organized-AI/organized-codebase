---
name: long-runner-commands
description: Slash commands for interacting with the long-runner skill.
version: 1.0.0
---

# Long-Runner Commands

## Available Commands

| Command | Description |
|---------|-------------|
| `/init-long-runner` | Initialize a new long-running project |
| `/feature-status` | Display current feature completion status |
| `/session-start` | Execute session start protocol |
| `/session-handoff` | Execute session end protocol |
| `/checkpoint` | Save progress without ending session |
| `/next-feature` | Show next recommended feature |

---

## /init-long-runner

Initialize a new project for long-running development.

**Usage:**
```
/init-long-runner "Project description"
```

**Actions:**
1. Creates `feature_list.json` with comprehensive features
2. Creates `claude-progress.txt` for session tracking
3. Creates `init.sh` for environment setup
4. Creates `.claude/long-runner-config.json`
5. Makes initial git commit

---

## /feature-status

Display the current state of all features.

**Usage:**
```
/feature-status
/feature-status --category functional
/feature-status --incomplete
```

**Output:**
```
Project: chat-app
Total: 156 | Completed: 42 (27%) | In Progress: 1

Next Up:
1. [feat-043] Data persistence setup
2. [feat-044] Database connection pool
```

---

## /session-start

Execute the full session start protocol.

**Actions:**
1. Reads progress from last session
2. Parses feature status
3. Reviews git history
4. Runs init.sh
5. Performs health check
6. Suggests next feature

---

## /session-handoff

Execute the full session end protocol.

**Actions:**
1. Checks for debug code
2. Runs all tests
3. Updates progress file
4. Updates feature list
5. Commits all changes
6. Generates handoff summary

---

## /checkpoint

Save current progress without ending session.

**Actions:**
1. Saves current feature progress
2. Appends to progress file
3. Optionally commits changes
4. Continues session

---

## /next-feature

Show the next recommended feature to work on.

**Output:**
```
[feat-046] Message search functionality
Category: functional
Priority: 2
Dependencies: feat-045 (✓ complete)

Steps to Verify:
1. Type in search box
2. Results filter in real-time
3. Click result to navigate
```

---

## Command Aliases

| Alias | Full Command |
|-------|--------------|
| `/lr-init` | `/init-long-runner` |
| `/lr-status` | `/feature-status` |
| `/lr-start` | `/session-start` |
| `/lr-end` | `/session-handoff` |
| `/lr-save` | `/checkpoint` |
| `/lr-next` | `/next-feature` |

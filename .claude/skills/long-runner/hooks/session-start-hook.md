---
name: session-start-hook
description: |
  Automatically orients agent at the start of a long-running project session.
  Reads progress files, git history, and feature status to provide context.
trigger: PreMessage
condition: First message of session AND project has long-runner infrastructure
version: 1.0.0
---

# Session Start Hook

## Purpose

This hook automatically runs at the beginning of each session for long-running projects. It provides the agent with all the context needed to continue work seamlessly.

## Trigger Conditions

The hook activates when:
1. It's the first message of a new session
2. The project has long-runner infrastructure (feature_list.json and claude-progress.txt exist)

## Hook Actions

```bash
# 1. Working Directory
pwd

# 2. Progress File
echo "=== LAST SESSION PROGRESS ==="
tail -100 claude-progress.txt

# 3. Feature Status
echo "=== FEATURE STATUS ==="
cat feature_list.json | jq '{
  total: .total_features,
  completed: .completed,
  in_progress: .in_progress
}'

# 4. Git History
echo "=== RECENT GIT HISTORY ==="
git log --oneline -15

# 5. Next Feature
echo "=== SUGGESTED NEXT FEATURE ==="
cat feature_list.json | jq '[.features[] | select(.passes == false)] | sort_by(.priority) | .[0]'
```

## Output Format

```
╔═══════════════════════════════════════════════════════╗
║              SESSION START ORIENTATION                 ║
╠═══════════════════════════════════════════════════════╣
║ Working Directory: /path/to/project                    ║
║ Progress: 42/156 features (27%)                        ║
║ Last Session: feat-041, feat-042 completed             ║
║ Next: Continue feat-043 or start feat-044              ║
╚═══════════════════════════════════════════════════════╝
```

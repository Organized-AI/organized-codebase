---
name: session-end-hook
description: |
  Ensures clean handoff when a long-running session ends.
  Validates that all required artifacts are updated and code is merge-ready.
trigger: PostMessage
condition: User indicates session is ending OR checkpoint triggered
version: 1.0.0
---

# Session End Hook

## Purpose

This hook ensures that every long-running session ends with a clean handoff. It validates that all required artifacts are updated and code is in a merge-ready state.

## Pre-Flight Checklist

Before the session can end, all items must be verified:

### Code State
- [ ] No debug code left (console.log, debugger, print statements)
- [ ] No commented-out code blocks
- [ ] No TODO/FIXME for current feature
- [ ] All new code follows project standards

### Tests
- [ ] All tests passing
- [ ] E2E tests run for completed features
- [ ] No new test failures introduced

### Git
- [ ] All changes committed
- [ ] Commit messages are descriptive
- [ ] No uncommitted files

### Documentation
- [ ] claude-progress.txt updated with session summary
- [ ] feature_list.json updated with feature status
- [ ] Any blockers documented

## Session End Protocol

### Step 1: Code Cleanup
```bash
# Check for debug code
grep -r "console.log\|debugger\|print(" src/
```

### Step 2: Run Tests
```bash
npm test
```

### Step 3: Update Progress File
```
--- SESSION N ---
Date: [timestamp]
Features Completed: feat-XXX, feat-YYY
In Progress: feat-ZZZ (60%)
Next Session Should: [priorities]
Code State: MERGE-READY
Tests: PASSING
```

### Step 4: Final Commit
```bash
git add -A
git commit -m "session: Complete features, prepare handoff

Completed: feat-XXX, feat-YYY
In Progress: feat-ZZZ (60%)
All tests passing. Code is merge-ready."
```

## Important Reminders

⚠️ **NEVER** end session with uncommitted work
⚠️ **NEVER** end session with failing tests
⚠️ **ALWAYS** update progress file before ending
⚠️ **ALWAYS** provide clear next steps for next session

---
name: session-checkpoint-hook
description: |
  Automatically saves progress when context reaches threshold levels.
  Triggers at 70%, 85%, and 95% context usage.
trigger: OnContextThreshold
thresholds:
  soft: 0.70
  hard: 0.85
  emergency: 0.95
version: 1.0.0
---

# Session Checkpoint Hook

## Purpose

This hook automatically saves progress when the context window reaches critical thresholds, preventing loss of work and ensuring clean handoffs.

## Trigger Thresholds

| Level | Threshold | Action |
|-------|-----------|--------|
| Soft | 70% | Save progress, evaluate continuation |
| Hard | 85% | Stop new work, complete current task, prepare handoff |
| Emergency | 95% | Force save, immediate session end |

## Soft Checkpoint (70%)

At 70% context, save current state but continue working.

- Note current feature being worked on
- Estimate completion percentage
- List uncommitted changes
- Evaluate: Can current feature be completed before 85%?

## Hard Checkpoint (85%)

At 85% context, stop new feature work and prepare for handoff.

1. STOP starting new features
2. Complete current task to safe stopping point
3. Remove any debug code
4. Run tests
5. Update progress file
6. Update feature_list.json
7. Commit all changes
8. Write handoff notes

## Emergency Checkpoint (95%)

At 95% context, force immediate save and session end.

1. STOP all work immediately
2. Save whatever is safe to save
3. Write minimal handoff notes
4. Force commit with emergency flag

```bash
git add -A
git commit -m "emergency: Session ended at 95% context - review needed"
```

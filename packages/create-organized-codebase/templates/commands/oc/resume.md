---
description: Restore context from last session handoff
---

# Resume Command

Restore context and continue from where the last session left off.

## Resume Process

### Step 1: Load Handoff Documentation

Read the session handoff:
```bash
cat PLANNING/HANDOFF.md 2>/dev/null || echo "No handoff found"
```

### Step 2: Verify Project State

```bash
# Current branch
git branch --show-current

# Uncommitted changes
git status --short

# Recent commits
git log --oneline -5
```

### Step 3: Load Context

Read key documents:
- `PLANNING/HANDOFF.md` - Last session state
- `PLANNING/STATE.md` - Current decisions
- `PLANNING/REQUIREMENTS.md` - What needs building
- `CLAUDE.md` - Project rules

### Step 4: Summarize State

Present what was loaded:

```
╔══════════════════════════════════════════════════════════════╗
║                   SESSION RESUMED                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Project:   [Name]                                           ║
║  Branch:    feature/user-auth                                ║
║  Last:      [timestamp from handoff]                         ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ CONTEXT LOADED                                          │ ║
║  ├─────────────────────────────────────────────────────────┤ ║
║  │                                                         │ ║
║  │ What Was Done:                                          │ ║
║  │   • Password reset API endpoint                         │ ║
║  │   • Email sending integration                           │ ║
║  │                                                         │ ║
║  │ In Progress:                                            │ ║
║  │   • Reset form UI component                             │ ║
║  │                                                         │ ║
║  │ Immediate Next Steps:                                   │ ║
║  │   1. Complete the reset form component                  │ ║
║  │   2. Add form validation                                │ ║
║  │   3. Connect to API                                     │ ║
║  │                                                         │ ║
║  │ Blockers: None                                          │ ║
║  │                                                         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  Ready to continue with: Reset form UI component             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Step 5: Suggest First Action

Based on handoff state, suggest what to do:

| State | Suggestion |
|-------|------------|
| Clear next steps | Start on first item |
| Blockers exist | Address blockers |
| No handoff found | Run `/status` instead |
| Uncommitted changes | Review and commit or stash |

## If No Handoff Exists

If `PLANNING/HANDOFF.md` doesn't exist:

```
╔══════════════════════════════════════════════════════════════╗
║                    NO HANDOFF FOUND                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  No previous session handoff was found.                      ║
║                                                              ║
║  This could mean:                                            ║
║    • This is a new project                                   ║
║    • Last session didn't use /oc:pause                       ║
║    • Handoff was deleted                                     ║
║                                                              ║
║  Suggested: Run /status to orient to current state           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Best Practices

1. **Read before acting** - Understand context before changing code
2. **Verify state matches** - Ensure git state matches handoff
3. **Ask if unclear** - Better to clarify than assume wrongly

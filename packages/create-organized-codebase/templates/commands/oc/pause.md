---
description: Create handoff documentation for session pause
---

# Pause Command

Create handoff documentation before ending a session. Enables seamless resume.

## When to Use

- End of work day
- Switching to different task
- Before context window limit
- Handing off to another AI session

## Handoff Process

### Step 1: Capture Current State

Gather:
```bash
# Uncommitted changes
git status --short
git diff --stat

# Current branch and recent commits
git branch --show-current
git log --oneline -3
```

### Step 2: Document Session State

Create or update `PLANNING/HANDOFF.md`:

```markdown
# Session Handoff

**Last Updated:** [timestamp]
**Branch:** [current branch]

## What Was Done
- [Completed item 1]
- [Completed item 2]

## Current State
- [What's in progress]
- [Files with uncommitted changes]

## Immediate Next Steps
1. [First thing to do on resume]
2. [Second thing]
3. [Third thing]

## Blockers/Questions
- [Any blockers encountered]
- [Questions that need answers]

## Context Notes
[Any important context that would be lost]
```

### Step 3: Update STATE.md

Ensure `PLANNING/STATE.md` reflects current decisions and blockers.

### Step 4: Commit Handoff (Optional)

If there's meaningful progress to preserve:

```bash
git add PLANNING/HANDOFF.md PLANNING/STATE.md
git commit -m "docs: Update session handoff"
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    SESSION PAUSED                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Branch:    feature/user-auth                                ║
║  Duration:  ~2 hours                                         ║
║                                                              ║
║  Completed:                                                  ║
║    ✓ Password reset API endpoint                             ║
║    ✓ Email sending integration                               ║
║                                                              ║
║  In Progress:                                                ║
║    ◐ Reset form UI component                                 ║
║                                                              ║
║  Handoff Created:                                            ║
║    • PLANNING/HANDOFF.md                                     ║
║                                                              ║
║  To Resume: Run /oc:resume                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Best Practices

1. **Always pause before context limit** - Don't wait until you lose context
2. **Be specific in next steps** - Future you (or AI) needs clear direction
3. **Note "why" not just "what"** - Context about decisions matters
4. **Commit if meaningful** - Don't lose work to uncommitted changes

---
description: Show current project state and next steps
---

# Progress Command

Display current project state, what's been accomplished, and what's next.

## Gather State

### 1. Read Planning Documents

```bash
# Check if planning docs exist
ls PLANNING/*.md 2>/dev/null
```

Read and summarize:
- `PLANNING/PROJECT.md` - Project vision
- `PLANNING/REQUIREMENTS.md` - What's done vs. pending
- `PLANNING/ROADMAP.md` - Current milestone
- `PLANNING/STATE.md` - Recent decisions/blockers

### 2. Git Activity

```bash
# Recent commits
git log --oneline -10

# Current branch
git branch --show-current

# Uncommitted changes
git status --short
```

### 3. Verification Status

```bash
npm run lint 2>/dev/null && echo "Lint: ✓" || echo "Lint: ✗"
npx tsc --noEmit 2>/dev/null && echo "Types: ✓" || echo "Types: ✗"
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    PROJECT PROGRESS                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Project:   [Name]                                           ║
║  Milestone: v1 MVP                                           ║
║  Branch:    feature/user-auth                                ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ REQUIREMENTS                                            │ ║
║  ├─────────────────────────────────────────────────────────┤ ║
║  │ ✓ User registration                                     │ ║
║  │ ✓ Login/logout                                          │ ║
║  │ ◐ Password reset (in progress)                          │ ║
║  │ ○ Email verification                                    │ ║
║  │ ○ OAuth integration                                     │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  Progress: 40% (2/5 complete)                                ║
║                                                              ║
║  Current Focus:                                              ║
║    Password reset flow implementation                        ║
║                                                              ║
║  Blockers:                                                   ║
║    None                                                      ║
║                                                              ║
║  Next Steps:                                                 ║
║    1. Complete password reset                                ║
║    2. Run /verify                                            ║
║    3. Start email verification                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Suggested Actions

Based on state, suggest appropriate next command:

| State | Suggestion |
|-------|------------|
| No planning docs | Run `/oc:new-project` |
| Has blockers | Address blockers first |
| Feature in progress | Continue implementation |
| Feature complete | Run `/verify` then `/commit` |
| Milestone complete | Run `/oc:discuss` for next phase |

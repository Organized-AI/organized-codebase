---
description: Session initialization ritual (Boris methodology)
---

# Session Start Command

Initialize a development session with proper orientation. Run this at the beginning of every working session.

## Session Start Checklist

### 1. Orient to Environment

```bash
# Confirm directory
pwd

# Check git state
git status --short
git branch --show-current
```

### 2. Project Health Check

Run quick verification:

```bash
npm run lint 2>/dev/null && echo "✓ Lint" || echo "✗ Lint"
npx tsc --noEmit 2>/dev/null && echo "✓ Types" || echo "✗ Types"
```

### 3. Load Context

Read key documents:
- `CLAUDE.md` - Project rules and conventions
- `PLANNING/STATE.md` - Current decisions and blockers
- `PLANNING/HANDOFF.md` - Last session notes (if exists)

### 4. Review Recent History

```bash
git log --oneline -5
```

### 5. Identify Today's Focus

Based on:
- Handoff next steps (if exists)
- Current milestone from `PLANNING/ROADMAP.md`
- Any blockers to address

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                   SESSION INITIALIZED                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Project:    [Name]                                          ║
║  Directory:  /path/to/project                                ║
║  Branch:     main                                            ║
║  Time:       [timestamp]                                     ║
║                                                              ║
║  Health:                                                     ║
║    ✓ Lint passing                                            ║
║    ✓ Types passing                                           ║
║    ✓ Working tree clean                                      ║
║                                                              ║
║  Context Loaded:                                             ║
║    ✓ CLAUDE.md (project rules)                               ║
║    ✓ PLANNING/STATE.md (current state)                       ║
║    ○ PLANNING/HANDOFF.md (no handoff found)                  ║
║                                                              ║
║  Recent Commits:                                             ║
║    • abc1234 feat: add user authentication                   ║
║    • def5678 fix: resolve login timeout                      ║
║    • ghi9012 docs: update API documentation                  ║
║                                                              ║
║  Suggested Focus:                                            ║
║    Continue with password reset feature                      ║
║                                                              ║
║  Ready to work. Remember: Plan → Implement → Verify          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## If Issues Found

| Issue | Action |
|-------|--------|
| Lint failing | Fix lint issues first |
| Uncommitted changes | Review and commit or stash |
| No CLAUDE.md | Consider running `/oc:new-project` |
| Blockers in STATE.md | Address blockers or update state |

## Best Practices

1. **Always start here** - Consistent orientation prevents mistakes
2. **Don't skip verification** - Catch issues before adding more
3. **Read the context** - CLAUDE.md rules save time
4. **Plan before coding** - Enter plan mode for non-trivial work

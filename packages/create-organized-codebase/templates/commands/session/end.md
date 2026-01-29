---
description: Session closure ritual (Boris methodology)
---

# Session End Command

Properly close a development session. Ensures nothing is lost and next session can start smoothly.

## Session End Checklist

### 1. Check Code State

```bash
# Any uncommitted changes?
git status --short

# What branch are we on?
git branch --show-current
```

### 2. Verification Status

```bash
# Are we leaving the codebase healthy?
npm run lint 2>/dev/null && echo "✓ Lint" || echo "✗ Lint"
npx tsc --noEmit 2>/dev/null && echo "✓ Types" || echo "✗ Types"
npm test 2>/dev/null && echo "✓ Tests" || echo "✗ Tests"
```

### 3. Handle Uncommitted Changes

If uncommitted changes exist:

**Option A: Commit them**
```bash
git add <files>
git commit -m "type(scope): description"
```

**Option B: Stash them**
```bash
git stash push -m "WIP: [description]"
```

**Option C: Leave as WIP**
- Document in handoff that changes are uncommitted
- Ensure they won't be lost

### 4. Create Handoff (if continuing later)

If work will continue, run `/oc:pause` to create handoff documentation.

### 5. Final State Summary

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    SESSION COMPLETE                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Duration:   ~3 hours                                        ║
║  Branch:     feature/user-auth                               ║
║                                                              ║
║  Accomplishments:                                            ║
║    ✓ Implemented password reset API                          ║
║    ✓ Added email integration                                 ║
║    ✓ Created reset form UI                                   ║
║                                                              ║
║  Final State:                                                ║
║    ✓ All changes committed                                   ║
║    ✓ Lint passing                                            ║
║    ✓ Types passing                                           ║
║    ✓ Tests passing                                           ║
║                                                              ║
║  Commits This Session:                                       ║
║    • abc1234 feat(auth): add password reset endpoint         ║
║    • def5678 feat(auth): integrate email service             ║
║    • ghi9012 feat(auth): create reset form component         ║
║                                                              ║
║  Next Session:                                               ║
║    • Connect form to API                                     ║
║    • Add success/error states                                ║
║                                                              ║
║  Handoff: Created (PLANNING/HANDOFF.md)                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Warnings

Show warnings for:

| Issue | Warning |
|-------|---------|
| Uncommitted changes | ⚠️ You have uncommitted changes |
| Lint failing | ⚠️ Lint is failing - consider fixing |
| No handoff created | ⚠️ Consider running /oc:pause for context preservation |
| Work in progress | ⚠️ Feature incomplete - document state |

## Best Practices

1. **Never leave tests failing** - Fix or revert before ending
2. **Commit meaningful progress** - Don't lose work
3. **Create handoff if continuing** - Future context matters
4. **Document blockers** - Don't forget what stopped you

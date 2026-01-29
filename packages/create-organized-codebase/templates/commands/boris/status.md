---
description: Project health check and orientation (Boris methodology)
---

# Status Command

Quick project health check for session orientation. Run this at the start of every session.

## Gather Information

Collect project state from multiple sources:

### 1. Git Status
```bash
git status --short
git log --oneline -5
```

### 2. Project Health
```bash
# Check for uncommitted changes
git diff --stat

# Check current branch
git branch --show-current
```

### 3. Verification Status
```bash
# Quick lint check
npm run lint 2>/dev/null && echo "Lint: ✓" || echo "Lint: ✗"

# Quick type check
npx tsc --noEmit 2>/dev/null && echo "Types: ✓" || echo "Types: ✗"
```

### 4. Project Context
- Read CLAUDE.md for project rules
- Check for any TODO items or blockers
- Review recent commits for context

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                     PROJECT STATUS                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Project:  {{projectName}}                                   ║
║  Branch:   main                                              ║
║  Status:   Clean working tree                                ║
║                                                              ║
║  Health:                                                     ║
║    ✓ Lint passing                                            ║
║    ✓ Types passing                                           ║
║    ✓ No uncommitted changes                                  ║
║                                                              ║
║  Recent Activity:                                            ║
║    • abc1234 feat: add user auth                             ║
║    • def5678 fix: resolve API timeout                        ║
║    • ghi9012 docs: update README                             ║
║                                                              ║
║  Ready to: Start new work                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Next Steps

Based on status, suggest:
- If uncommitted changes: Review and commit or stash
- If on feature branch: Continue work or merge
- If clean: Ready for new task

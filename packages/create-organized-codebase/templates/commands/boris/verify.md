---
description: Run all verification checks before committing (Boris methodology)
---

# Verify Command

Run comprehensive verification checks before any commit. This is the cornerstone of Boris methodology.

## Verification Checklist

Execute these checks in order:

### 1. Code Quality
```bash
# TypeScript/JavaScript
npm run lint 2>/dev/null || npx eslint . --ext .ts,.tsx,.js,.jsx 2>/dev/null || echo "No linter configured"

# Type checking
npm run typecheck 2>/dev/null || npx tsc --noEmit 2>/dev/null || echo "No TypeScript configured"
```

### 2. Tests
```bash
npm test 2>/dev/null || npm run test 2>/dev/null || echo "No tests configured"
```

### 3. Build Check
```bash
npm run build 2>/dev/null || echo "No build script configured"
```

### 4. Manual Checklist

Review and confirm:
- [ ] No `console.log` or debug statements left in code
- [ ] No commented-out code blocks
- [ ] No TODO comments without issue links
- [ ] No hardcoded secrets or credentials
- [ ] Changes match the original intent

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    VERIFICATION RESULTS                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ✓ Lint:       Passed                                        ║
║  ✓ Types:      Passed                                        ║
║  ✓ Tests:      Passed (24/24)                                ║
║  ✓ Build:      Passed                                        ║
║                                                              ║
║  Status: READY TO COMMIT                                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## If Verification Fails

1. Fix the issues identified
2. Run `/verify` again
3. Only proceed to `/commit` when all checks pass

## Next Step

If all checks pass, run `/commit` to create a verified commit.

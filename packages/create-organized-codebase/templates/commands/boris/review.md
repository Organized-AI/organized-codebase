---
description: Self-review before creating PR (Boris methodology)
---

# Review Command

Comprehensive self-review before creating a pull request. Catches issues before they reach reviewers.

## Review Process

### Step 1: Gather Changes

```bash
# Get the diff from main branch
git diff main...HEAD --stat
git diff main...HEAD
```

### Step 2: Code Review Checklist

For each changed file, verify:

**Correctness**
- [ ] Logic is correct and handles edge cases
- [ ] Error handling is appropriate
- [ ] No security vulnerabilities introduced

**Quality**
- [ ] Code follows project conventions (from CLAUDE.md)
- [ ] No duplicate code that should be refactored
- [ ] Functions are reasonably sized (<50 lines ideal)

**Cleanliness**
- [ ] No debug statements (console.log, print, etc.)
- [ ] No commented-out code
- [ ] No TODO without issue reference
- [ ] No hardcoded values that should be config

**Documentation**
- [ ] Complex logic has explanatory comments
- [ ] Public APIs have documentation
- [ ] README updated if needed

### Step 3: Architecture Check

Review overall changes for:
- [ ] Changes are in correct files/directories
- [ ] No circular dependencies introduced
- [ ] Imports follow project conventions
- [ ] Tests cover new functionality

### Step 4: Run Full Verification

```bash
# Full verification suite
npm run lint
npm run typecheck
npm test
npm run build
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                      REVIEW SUMMARY                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Branch:     feature/user-auth                               ║
║  Commits:    5                                               ║
║  Files:      12 changed                                      ║
║                                                              ║
║  Review:                                                     ║
║    ✓ Code correctness verified                               ║
║    ✓ Code quality checks passed                              ║
║    ✓ No debug statements found                               ║
║    ✓ Architecture looks good                                 ║
║                                                              ║
║  Verification:                                               ║
║    ✓ Lint passed                                             ║
║    ✓ Types passed                                            ║
║    ✓ Tests passed (48/48)                                    ║
║    ✓ Build passed                                            ║
║                                                              ║
║  Status: READY FOR PR                                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Issues Found?

If issues are found during review:
1. Fix the issues
2. Commit the fixes
3. Run `/review` again
4. Only create PR when review passes

## Creating the PR

When review passes, create the PR:

```bash
gh pr create --title "feat: description" --body "## Summary
- Point 1
- Point 2

## Test Plan
- Manual testing done
- Unit tests added"
```

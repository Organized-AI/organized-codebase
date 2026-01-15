---
description: Run all verification checks (Boris methodology)
---

# Verify Current Work

Run a complete verification suite to ensure code quality before committing.

## Verification Steps

Execute these checks in order:

### 1. Git Status Check
```bash
git status
```
Report any uncommitted changes or untracked files.

### 2. Linting (if available)
```bash
npm run lint 2>/dev/null || echo "No lint script configured"
```

### 3. Type Checking (if TypeScript)
```bash
npm run typecheck 2>/dev/null || npx tsc --noEmit 2>/dev/null || echo "No TypeScript configured"
```

### 4. Tests (if available)
```bash
npm test 2>/dev/null || echo "No test script configured"
```

### 5. Build Check (if available)
```bash
npm run build 2>/dev/null || echo "No build script configured"
```

## Output Format

Report results as:

```
═══════════════════════════════════════════
  VERIFICATION REPORT
═══════════════════════════════════════════

Git Status:     ✅ Clean / ⚠️ Uncommitted changes
Linting:        ✅ Passed / ❌ X errors / ⏭️ Skipped
Type Check:     ✅ Passed / ❌ X errors / ⏭️ Skipped
Tests:          ✅ Passed / ❌ X failed / ⏭️ Skipped
Build:          ✅ Passed / ❌ Failed / ⏭️ Skipped

Overall:        ✅ READY TO COMMIT / ❌ NEEDS FIXES
═══════════════════════════════════════════
```

## On Failure

If any check fails:
1. List specific errors clearly
2. Suggest fixes if obvious
3. Do NOT proceed with commits until issues are resolved

## Philosophy

> "Always give Claude a way to verify its work." - Boris (Claude Code Creator)

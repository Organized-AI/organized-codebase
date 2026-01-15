---
description: Self-review before PR (Boris methodology)
---

# Self-Review

Perform a thorough self-review of changes before creating a PR.

## Review Process

### Step 1: Get Full Diff
```bash
git diff main...HEAD
```
Or compare against the appropriate base branch.

### Step 2: Automated Checks

Run verification suite:
```bash
npm run lint 2>/dev/null
npm test 2>/dev/null
npm run build 2>/dev/null
```

### Step 3: Code Review Checklist

Review all changes for:

**🔍 Code Quality**
- [ ] No `console.log` statements left in
- [ ] No commented-out code
- [ ] No TODO comments without issue links
- [ ] No hardcoded values that should be config

**🔒 Security**
- [ ] No secrets or API keys committed
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Input validation present where needed

**📝 Documentation**
- [ ] Public APIs documented
- [ ] Complex logic has comments
- [ ] README updated if needed

**🧪 Testing**
- [ ] New code has tests
- [ ] Edge cases covered
- [ ] Tests are passing

**🏗️ Architecture**
- [ ] Follows existing patterns
- [ ] No circular dependencies
- [ ] Proper error handling

### Step 4: Summary Report

```
═══════════════════════════════════════════
  SELF-REVIEW REPORT
═══════════════════════════════════════════

Files Changed: X files (+Y/-Z lines)
Commits: N commits since main

Automated Checks:
  Lint:     ✅/❌
  Tests:    ✅/❌
  Build:    ✅/❌

Code Review:
  Quality:     ✅ No issues / ⚠️ X issues found
  Security:    ✅ No issues / ⚠️ X issues found
  Docs:        ✅ Complete / ⚠️ Needs updates
  Tests:       ✅ Coverage good / ⚠️ Missing tests

Issues Found:
  1. [issue description]
  2. [issue description]

Recommendation: ✅ READY FOR PR / ⚠️ NEEDS WORK
═══════════════════════════════════════════
```

## If Issues Found

List each issue with:
- File and line number
- Description of problem
- Suggested fix

## Philosophy

> "Claude reviews its own work before asking humans to review."

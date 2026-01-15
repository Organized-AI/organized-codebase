---
description: Project health check (Boris methodology)
---

# Project Status

Get a comprehensive health check of the project.

## Status Checks

### 1. Git Health
```bash
git status
git log --oneline -5
git branch -vv
```

Report:
- Current branch and tracking status
- Uncommitted changes
- Recent commit history
- Behind/ahead of remote

### 2. Dependency Health
```bash
npm outdated 2>/dev/null || echo "No npm project"
```

Report outdated packages if any.

### 3. Test Coverage (if available)
```bash
npm test -- --coverage 2>/dev/null || echo "No coverage configured"
```

### 4. Build Status
```bash
npm run build 2>/dev/null && echo "Build: OK" || echo "Build: FAILED or not configured"
```

### 5. TODO/FIXME Scan
```bash
grep -r "TODO\|FIXME" --include="*.ts" --include="*.js" --include="*.md" . 2>/dev/null | head -10
```

## Output Format

```
═══════════════════════════════════════════
  PROJECT STATUS
═══════════════════════════════════════════

📁 Project: [project name]
🌿 Branch:  [current branch] → [remote tracking]
📊 Status:  [clean/X uncommitted changes]

Recent Commits:
  abc1234 feat: Latest feature
  def5678 fix: Bug fix
  ghi9012 docs: Documentation update

Dependencies:
  ✅ All up to date
  ─── OR ───
  ⚠️ X packages outdated:
     - package@current → latest

Tests:
  ✅ X passing, Y% coverage
  ─── OR ───
  ❌ X failing
  ─── OR ───
  ⏭️ Not configured

Build:
  ✅ Successful
  ─── OR ───
  ❌ Failed
  ─── OR ───
  ⏭️ Not configured

TODOs Found: X items
  [list if any]

═══════════════════════════════════════════
Overall Health: ✅ HEALTHY / ⚠️ NEEDS ATTENTION / ❌ CRITICAL
═══════════════════════════════════════════
```

## Recommendations

If issues found, provide actionable recommendations:
- Outdated deps → "Run `npm update` or review breaking changes"
- Failing tests → "Fix tests before continuing development"
- TODOs → "Consider addressing or creating issues"

## Usage

Run `/status` at the start of each session to understand project state before making changes.

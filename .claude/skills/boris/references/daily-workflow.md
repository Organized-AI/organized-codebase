# Boris Daily Workflow Reference

Quick reference for daily development workflow using Boris methodology.

---

## Morning Routine

```bash
# 1. Orient to project
/status

# 2. Check what's pending
git log --oneline -5
cat CLAUDE.md | head -50

# 3. Review any blockers from yesterday
# (Check claude-progress.txt if long-runner project)
```

---

## Feature Development Loop

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────┐    ┌───────────┐    ┌────────┐    ┌────────┐ │
│   │  PLAN   │───▶│ IMPLEMENT │───▶│ VERIFY │───▶│ COMMIT │ │
│   └─────────┘    └───────────┘    └────────┘    └────────┘ │
│        │                               │                    │
│        │                               │                    │
│        ▼                               ▼                    │
│   "How will I              "Did my verification             │
│    verify this?"            approach work?"                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: Plan
```
Before implementing, state:
- What I'm building
- How I'll verify it works
- What tests/checks I'll run
```

### Step 2: Implement
```
- ONE feature at a time
- No debug statements
- No half-finished code
- Follow CLAUDE.md conventions
```

### Step 3: Verify
```bash
/verify

# Or manually:
npm run lint
npm test
npm run build
```

### Step 4: Commit
```bash
/commit

# This will:
# 1. Run /verify first
# 2. Show diff summary
# 3. Generate commit message
# 4. Ask for confirmation
```

---

## Pre-PR Checklist

```bash
# 1. Self-review
/review

# 2. Architecture check (if significant changes)
# Invoke verify-architecture agent

# 3. Build validation (if release)
# Invoke verify-build agent

# 4. Create PR
gh pr create --title "feat: ..." --body "..."
```

---

## End of Day

```bash
# 1. Ensure clean state
git status

# 2. Commit any remaining work
/commit

# 3. Document blockers (if any)
# Add to claude-progress.txt or create TODO
```

---

## Command Quick Reference

| Situation | Command |
|-----------|---------|
| Start session | `/status` |
| Before commit | `/verify` |
| Create commit | `/commit` |
| Before PR | `/review` |
| Check health | `/status` |
| Complex project | `/long-runner` |
| Phased build | `/phased-build` |

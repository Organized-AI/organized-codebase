# Git Worktree Workflows

## Workflow 1: PR Review Without Context Switching

**Scenario:** Review a PR while keeping current work intact.

```bash
# 1. Fetch the PR
git fetch origin pull/123/head:pr-123

# 2. Create worktree for review
git worktree add ../reviews/pr-123 pr-123

# 3. Navigate and review
cd ../reviews/pr-123
# Run tests, inspect code, etc.

# 4. Cleanup after review
cd -
git worktree remove ../reviews/pr-123
git branch -D pr-123
```

**Directory structure:**
```
project/
├── main-worktree/     <- Your active development
└── reviews/
    └── pr-123/        <- Isolated PR review
```

---

## Workflow 2: Hotfix While Feature Development Continues

**Scenario:** Production bug requires immediate fix, but you're mid-feature.

```bash
# 1. Create hotfix worktree from production branch
git worktree add -b hotfix/critical-bug ../hotfix origin/production

# 2. Fix in hotfix worktree (your feature work untouched)
cd ../hotfix
# Make fixes, test, commit

# 3. Push and create PR for hotfix
git push -u origin hotfix/critical-bug

# 4. Return to feature work
cd ../main-worktree

# 5. Cleanup after merge
git worktree remove ../hotfix
git branch -D hotfix/critical-bug
```

---

## Workflow 3: Parallel Feature Development

**Scenario:** Work on multiple features, switching between them frequently.

```bash
# Setup worktrees for each feature
git worktree add ../feature-auth feature/authentication
git worktree add ../feature-api feature/api-v2
git worktree add ../feature-ui feature/new-dashboard

# Each worktree is independent - switch by changing directories
cd ../feature-auth   # Work on auth
cd ../feature-api    # Switch to API work
cd ../feature-ui     # Switch to UI work

# All share the same .git, so fetches/pushes affect all
git fetch --all  # Run from any worktree
```

---

## Workflow 4: CI/CD Pipeline Integration

**Scenario:** Build multiple branches in parallel without interference.

```bash
# CI script creates isolated worktrees for each build
BUILD_ID="build-${CI_PIPELINE_ID}"
WORKTREE_PATH="/tmp/builds/${BUILD_ID}"

# Create worktree for this build
git worktree add --detach "$WORKTREE_PATH" "$CI_COMMIT_SHA"

# Lock to prevent accidental pruning
git worktree lock "$WORKTREE_PATH" --reason "CI build in progress"

# Run build in isolation
cd "$WORKTREE_PATH"
npm ci && npm run build && npm test

# Cleanup
git worktree unlock "$WORKTREE_PATH"
git worktree remove "$WORKTREE_PATH"
```

---

## Workflow 5: Comparing Implementations

**Scenario:** Compare two different approaches to the same problem.

```bash
# Create worktrees for each approach
git worktree add -b approach-a ../approach-a main
git worktree add -b approach-b ../approach-b main

# Implement approach A
cd ../approach-a
# ... code ...

# Implement approach B
cd ../approach-b
# ... code ...

# Compare side by side
diff -r ../approach-a/src ../approach-b/src

# Keep the winner, remove the other
git worktree remove ../approach-b
git branch -D approach-b
```

---

## Workflow 6: Long-Running Experiment Branch

**Scenario:** Experimental work that runs for weeks alongside main development.

```bash
# Create experiment worktree
git worktree add -b experiment/new-architecture ../experiment main

# Lock it to prevent accidental deletion
git worktree lock ../experiment --reason "Long-running architecture experiment"

# Periodically sync with main
cd ../experiment
git fetch origin main
git rebase origin/main

# When experiment concludes
git worktree unlock ../experiment
# Either merge or remove
```

---

## Best Practices

### Naming Conventions
```
../worktrees/<type>/<name>
├── reviews/pr-123
├── hotfixes/issue-456
├── features/auth-refactor
└── experiments/new-db
```

### Directory Organization
Keep worktrees as siblings to main repo:
```
projects/
├── my-repo/              <- Main worktree
└── my-repo-worktrees/    <- All worktrees
    ├── pr-123/
    ├── hotfix-456/
    └── feature-auth/
```

### Cleanup Routine
```bash
# Weekly cleanup: prune stale references
git worktree prune --dry-run  # Preview first
git worktree prune            # Then execute

# List and review active worktrees
git worktree list
```

---

## Case Study: Parallel Feature Build with Subagents

**Real-world example:** Building the `changelog-updater` skill with 11 features using worktrees + parallel Claude Code subagents.

### The Challenge

Build 11 TypeScript modules (feat-002 through feat-012) with:
- Clear dependency chain (some features depend on others)
- Need for parallel development where possible
- Isolation to prevent merge conflicts
- Shared codebase for type imports

### Solution: Worktree-per-Feature Architecture

```
Organized Codebase/                    <- Main repo (main branch)
├── .git/                              <- Shared git database
└── .claude/skills/changelog-updater/

changelog-updater-feat-008/            <- Worktree for feat-008
├── .git (file pointing to main)
└── .claude/skills/changelog-updater/lib/
    ├── diff-detector.ts               <- Copied from earlier features
    ├── entry-parser.ts
    └── migration-handler.ts           <- NEW: built here

changelog-updater-feat-009/            <- Worktree for feat-009
changelog-updater-feat-010/            <- Worktree for feat-010
changelog-updater-feat-011/            <- Worktree for feat-011 (parallel with 010)
changelog-updater-feat-012/            <- Worktree for feat-012
```

### Execution Flow

```bash
# Phase 1: Create worktrees for each feature
cd "Organized Codebase"
git worktree add "../changelog-updater-feat-008" -b feat/changelog-updater-008-migration-handler main
git worktree add "../changelog-updater-feat-009" -b feat/changelog-updater-009-ack-tracker main
git worktree add "../changelog-updater-feat-010" -b feat/changelog-updater-010-integration main
git worktree add "../changelog-updater-feat-011" -b feat/changelog-updater-011-batch-apply main
git worktree add "../changelog-updater-feat-012" -b feat/changelog-updater-012-summary-report main

# Phase 2: Build features (copy dependencies, implement, test, commit)
# Each worktree gets dependencies from previous features:
cp -r "../changelog-updater-feat-008/lib/"*.ts "../changelog-updater-feat-009/lib/"

# Phase 3: Parallel builds (feat-010 and feat-011 have same dependency)
# Launch two subagents simultaneously - each works in its own worktree

# Phase 4: Merge all features sequentially
git merge feat/changelog-updater-008-migration-handler -m "Merge feat-008"
git merge feat/changelog-updater-009-ack-tracker -m "Merge feat-009"
git merge feat/changelog-updater-010-integration -m "Merge feat-010"
git merge feat/changelog-updater-011-batch-apply -m "Merge feat-011"
git merge feat/changelog-updater-012-summary-report -m "Merge feat-012"

# Phase 5: Cleanup all worktrees
for i in 008 009 010 011 012; do
  git worktree remove "../changelog-updater-feat-$i" --force
done
git worktree prune
```

### Key Insights

| Aspect | Benefit |
|--------|---------|
| **Isolation** | Each subagent works in its own directory - no branch conflicts |
| **Parallelism** | feat-010 and feat-011 built simultaneously (same dependency) |
| **Dependency management** | Copy `.ts` files from previous worktrees as needed |
| **Shared .git** | No cloning overhead - instant worktree creation |
| **Clean merges** | Each feature branch merges cleanly into main |

### Dependency-Aware Parallelization

```
feat-008 (migration-handler)
    ↓
feat-009 (ack-tracker)
    ↓
    ├── feat-010 (integration)      ← PARALLEL
    └── feat-011 (batch-apply)      ← PARALLEL
            ↓
        feat-012 (summary-report)
```

**Result:** 11 modules, 228 tests, built in ~15 minutes with 2 parallel subagent phases.

### Commands Used

```bash
# Create worktree with new branch from main
git worktree add "<path>" -b <branch-name> main

# List all worktrees with commit info
git worktree list

# Remove worktree (after merge)
git worktree remove "<path>" --force

# Prune stale worktree references
git worktree prune
```

This pattern works for any multi-feature build where:
1. Features have clear dependencies
2. Some features can be parallelized
3. Each feature needs isolated development
4. Final result merges into a single branch

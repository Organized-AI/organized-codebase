---
name: git-worktree-master
description: |
  Master orchestrator for git worktree operations - managing parallel branches, isolated workspaces, and efficient multi-branch workflows. Use when: (1) User needs to work on multiple branches simultaneously, (2) User wants to review PRs without switching branches, (3) User needs hotfix isolation while feature work continues, (4) User asks about worktrees, parallel development, or branch isolation, (5) CI/CD pipelines need isolated build environments, (6) User mentions "worktree", "parallel branches", "isolated workspace", or "branch without switching".
---

# Git Worktree Master

Manage multiple working directories attached to a single repository. Worktrees enable parallel development without stashing, cloning, or context switching.

## Quick Reference

```bash
# Create worktree from branch
git worktree add <path> <branch>

# Create worktree with new branch
git worktree add -b <new-branch> <path> [start-point]

# List all worktrees
git worktree list

# Remove worktree
git worktree remove <path>

# Prune stale references
git worktree prune
```

## Helper Scripts

Located in `scripts/` directory:

| Script | Purpose | Usage |
|--------|---------|-------|
| `wt-create.sh` | Smart worktree creation | `wt-create.sh <branch> [base-path]` |
| `wt-list.sh` | Enhanced listing with status | `wt-list.sh [--status]` |
| `wt-cleanup.sh` | Safe removal + pruning | `wt-cleanup.sh [path] [--force]` |
| `wt-switch.sh` | Navigate between worktrees | `wt-switch.sh [name-or-number]` |

## Common Workflows

### PR Review (Isolated)
```bash
git fetch origin pull/123/head:pr-123
git worktree add ../reviews/pr-123 pr-123
cd ../reviews/pr-123
# Review, test, then cleanup
git worktree remove ../reviews/pr-123
```

### Hotfix (While Feature Work Continues)
```bash
git worktree add -b hotfix/bug-456 ../hotfix origin/main
cd ../hotfix
# Fix, commit, push
git worktree remove ../hotfix
```

### Parallel Features
```bash
git worktree add ../feature-a feature/auth
git worktree add ../feature-b feature/api
# Switch by changing directories, not branches
```

### Multi-Feature Build with Subagents
```bash
# Create worktrees for parallel feature development
git worktree add "../feat-010" -b feat/integration main
git worktree add "../feat-011" -b feat/batch-apply main

# Build in parallel (each subagent in own worktree)
# Merge sequentially when complete
git merge feat/integration -m "Merge feat-010"
git merge feat/batch-apply -m "Merge feat-011"

# Cleanup
git worktree remove "../feat-010" --force
git worktree remove "../feat-011" --force
```
*See [workflows.md](references/workflows.md#case-study-parallel-feature-build-with-subagents) for full case study.*

## Directory Organization

Recommended structure:
```
project/
├── main/                    <- Main worktree
└── worktrees/               <- All additional worktrees
    ├── reviews/pr-123/
    ├── hotfixes/bug-456/
    └── features/new-auth/
```

## Key Concepts

- **Shared .git**: All worktrees share one repository database
- **Branch exclusivity**: Each branch can only be checked out in ONE worktree
- **Lock/unlock**: Prevent accidental pruning of important worktrees
- **Repair**: Fix paths after moving worktree directories

## Resources

- [commands.md](references/commands.md) - Complete command reference with all flags
- [workflows.md](references/workflows.md) - Detailed workflow guides for all use cases

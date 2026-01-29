# Git Worktree Command Reference

## Core Commands

### Create Worktree

```bash
# Create from existing local branch
git worktree add <path> <branch>

# Create new branch and worktree simultaneously
git worktree add -b <new-branch> <path> [<start-point>]

# Create from remote branch (tracking)
git worktree add <path> <remote>/<branch>

# Create detached HEAD worktree
git worktree add --detach <path> <commit>
```

### List Worktrees

```bash
# Simple list
git worktree list

# Porcelain output (for scripting)
git worktree list --porcelain

# With verbose details
git worktree list -v
```

### Remove Worktree

```bash
# Remove worktree (fails if dirty)
git worktree remove <path>

# Force remove (even if dirty)
git worktree remove --force <path>

# Remove and delete branch
git worktree remove <path> && git branch -d <branch>
```

### Maintenance

```bash
# Prune stale worktree references
git worktree prune

# Dry-run prune (see what would be removed)
git worktree prune --dry-run

# Lock worktree (prevent pruning)
git worktree lock <path> --reason "In use by CI"

# Unlock worktree
git worktree unlock <path>

# Repair worktree paths after move
git worktree repair [<path>...]
```

## Common Patterns

### PR Review Worktree

```bash
# Fetch PR and create worktree
git fetch origin pull/<PR_NUMBER>/head:pr-<PR_NUMBER>
git worktree add ../pr-<PR_NUMBER> pr-<PR_NUMBER>
```

### Hotfix Worktree

```bash
# Create hotfix branch from production
git worktree add -b hotfix/issue-123 ../hotfix-123 origin/main
```

### Parallel Feature Development

```bash
# Main worktree stays on current branch
# Create worktrees for each feature
git worktree add ../feature-a feature/auth
git worktree add ../feature-b feature/api
```

## Flags Reference

| Flag | Command | Description |
|------|---------|-------------|
| `-b <branch>` | add | Create new branch |
| `-B <branch>` | add | Create or reset branch |
| `--detach` | add | Create detached HEAD |
| `--force` | add/remove | Override safety checks |
| `--lock` | add | Lock worktree after creation |
| `--reason` | lock | Provide lock reason |
| `--porcelain` | list | Machine-readable output |
| `--dry-run` | prune | Preview prune results |
| `-v, --verbose` | prune | Show verbose output |

## Error Solutions

### "fatal: '<branch>' is already checked out"
The branch is active in another worktree. Use `git worktree list` to find it.

### "fatal: '<path>' already exists"
Directory exists. Remove it or choose different path.

### Worktree not found after moving
Run `git worktree repair` from main worktree or specify new path.

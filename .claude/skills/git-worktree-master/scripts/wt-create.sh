#!/bin/bash
# wt-create.sh - Smart worktree creation with naming conventions
# Usage: wt-create.sh <branch> [base-path]

set -e

BRANCH="${1:?Usage: wt-create.sh <branch> [base-path]}"
BASE_PATH="${2:-../worktrees}"

# Ensure we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository" >&2
    exit 1
fi

# Hierarchical naming: preserves branch structure as directories
# Examples:
#   feature/user-auth → feature/user-auth (creates nested dirs)
#   hotfix/issue-123  → hotfix/issue-123
#   origin/main       → main (strips remote prefix)
#   refs/heads/foo    → foo (strips refs prefix)
# For flat naming or custom conventions, use organized-codebase-applicator
branch_to_dirname() {
    local branch="$1"

    # Strip remote prefixes (origin/, upstream/, etc.)
    branch="${branch#origin/}"
    branch="${branch#upstream/}"
    branch="${branch#refs/heads/}"
    branch="${branch#refs/remotes/*/}"

    # Remove any leading/trailing slashes
    branch="${branch#/}"
    branch="${branch%/}"

    # Replace problematic characters (spaces, colons) with dashes
    branch="${branch// /-}"
    branch="${branch//:/-}"

    echo "$branch"
}

DIRNAME=$(branch_to_dirname "$BRANCH")
WORKTREE_PATH="${BASE_PATH}/${DIRNAME}"

# Check if branch exists locally or remotely
if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
    echo "Creating worktree from local branch: $BRANCH"
    git worktree add "$WORKTREE_PATH" "$BRANCH"
elif git show-ref --verify --quiet "refs/remotes/origin/${BRANCH}"; then
    echo "Creating worktree from remote branch: origin/$BRANCH"
    git worktree add --track -b "$BRANCH" "$WORKTREE_PATH" "origin/$BRANCH"
else
    echo "Branch '$BRANCH' not found locally or remotely."
    read -p "Create new branch from HEAD? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git worktree add -b "$BRANCH" "$WORKTREE_PATH"
    else
        exit 1
    fi
fi

echo ""
echo "✓ Worktree created at: $WORKTREE_PATH"
echo "  cd $WORKTREE_PATH"

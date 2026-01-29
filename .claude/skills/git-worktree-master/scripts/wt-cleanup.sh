#!/bin/bash
# wt-cleanup.sh - Safely remove worktrees and prune stale references
# Usage: wt-cleanup.sh [path] [--force] [--prune-only]

set -e

WORKTREE_PATH=""
FORCE=false
PRUNE_ONLY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --force|-f)
            FORCE=true
            shift
            ;;
        --prune-only|-p)
            PRUNE_ONLY=true
            shift
            ;;
        *)
            WORKTREE_PATH="$1"
            shift
            ;;
    esac
done

# Ensure we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository" >&2
    exit 1
fi

# If prune-only, just prune and exit
if [[ "$PRUNE_ONLY" == true ]]; then
    echo "Checking for stale worktree references..."
    PRUNABLE=$(git worktree prune --dry-run 2>&1)
    if [[ -z "$PRUNABLE" ]]; then
        echo "✓ No stale references to prune"
    else
        echo "Found stale references:"
        echo "$PRUNABLE"
        echo ""
        read -p "Prune these references? [y/N] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git worktree prune -v
            echo "✓ Pruned stale references"
        fi
    fi
    exit 0
fi

# If no path specified, show interactive selection
if [[ -z "$WORKTREE_PATH" ]]; then
    echo "Select worktree to remove:"
    echo ""

    # Get list of worktrees (skip the main one)
    MAIN_WORKTREE=$(git rev-parse --show-toplevel)
    mapfile -t WORKTREES < <(git worktree list --porcelain | grep "^worktree " | cut -d' ' -f2- | grep -v "^${MAIN_WORKTREE}$")

    if [[ ${#WORKTREES[@]} -eq 0 ]]; then
        echo "No additional worktrees found (only main worktree exists)"
        exit 0
    fi

    for i in "${!WORKTREES[@]}"; do
        WT="${WORKTREES[$i]}"
        BRANCH=$(git worktree list | grep "^${WT}" | awk '{print $3}' | tr -d '[]')
        printf "%d) %s (%s)\n" $((i+1)) "$WT" "$BRANCH"
    done

    echo ""
    read -p "Enter number (or 'q' to quit): " SELECTION

    if [[ "$SELECTION" == "q" ]]; then
        exit 0
    fi

    if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [[ "$SELECTION" -lt 1 ]] || [[ "$SELECTION" -gt ${#WORKTREES[@]} ]]; then
        echo "Invalid selection" >&2
        exit 1
    fi

    WORKTREE_PATH="${WORKTREES[$((SELECTION-1))]}"
fi

# Check if worktree exists
if ! git worktree list | grep -q "^${WORKTREE_PATH}"; then
    echo "Error: Worktree not found: $WORKTREE_PATH" >&2
    exit 1
fi

# Get branch name for this worktree
BRANCH=$(git worktree list | grep "^${WORKTREE_PATH}" | awk '{print $3}' | tr -d '[]')

# Check for uncommitted changes
if [[ -d "$WORKTREE_PATH" ]]; then
    CHANGES=$(cd "$WORKTREE_PATH" && git status --porcelain 2>/dev/null)
    if [[ -n "$CHANGES" ]] && [[ "$FORCE" != true ]]; then
        echo "Warning: Worktree has uncommitted changes:"
        echo "$CHANGES" | head -10
        echo ""
        read -p "Force remove anyway? [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
        FORCE=true
    fi
fi

# Remove worktree
echo "Removing worktree: $WORKTREE_PATH"
if [[ "$FORCE" == true ]]; then
    git worktree remove --force "$WORKTREE_PATH"
else
    git worktree remove "$WORKTREE_PATH"
fi
echo "✓ Worktree removed"

# Offer to delete branch
if [[ "$BRANCH" != "(detached)" ]] && [[ -n "$BRANCH" ]]; then
    read -p "Delete branch '$BRANCH' as well? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if git branch -d "$BRANCH" 2>/dev/null; then
            echo "✓ Branch deleted"
        else
            read -p "Branch not fully merged. Force delete? [y/N] " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git branch -D "$BRANCH"
                echo "✓ Branch force deleted"
            fi
        fi
    fi
fi

# Prune stale references
git worktree prune
echo "✓ Stale references pruned"

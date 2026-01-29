#!/bin/bash
# wt-list.sh - Enhanced worktree listing with status
# Usage: wt-list.sh [--status]

set -e

SHOW_STATUS=false
if [[ "$1" == "--status" ]]; then
    SHOW_STATUS=true
fi

# Ensure we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository" >&2
    exit 1
fi

echo "Git Worktrees:"
echo "=============="
echo ""

# Parse worktree list
git worktree list --porcelain | while read -r line; do
    case "$line" in
        "worktree "*)
            WORKTREE_PATH="${line#worktree }"
            ;;
        "HEAD "*)
            HEAD="${line#HEAD }"
            SHORT_HEAD="${HEAD:0:7}"
            ;;
        "branch "*)
            BRANCH="${line#branch refs/heads/}"
            ;;
        "detached")
            BRANCH="(detached)"
            ;;
        "locked"*)
            LOCKED="🔒"
            ;;
        "prunable"*)
            LOCKED="⚠️ prunable"
            ;;
        "")
            # End of worktree entry, print it
            printf "%-50s %-25s %s\n" "$WORKTREE_PATH" "$BRANCH" "${LOCKED:-}"

            if [[ "$SHOW_STATUS" == true ]] && [[ -d "$WORKTREE_PATH" ]]; then
                # Show git status for this worktree
                STATUS=$(cd "$WORKTREE_PATH" && git status --porcelain 2>/dev/null | head -5)
                if [[ -n "$STATUS" ]]; then
                    echo "    Status:"
                    echo "$STATUS" | sed 's/^/      /'
                    REMAINING=$(cd "$WORKTREE_PATH" && git status --porcelain 2>/dev/null | tail -n +6 | wc -l | tr -d ' ')
                    if [[ "$REMAINING" -gt 0 ]]; then
                        echo "      ... and $REMAINING more files"
                    fi
                fi
            fi

            # Reset for next entry
            LOCKED=""
            BRANCH=""
            ;;
    esac
done

echo ""
echo "Total: $(git worktree list | wc -l | tr -d ' ') worktree(s)"

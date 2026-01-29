#!/bin/bash
# wt-switch.sh - Quick navigation between worktrees
# Usage: wt-switch.sh [worktree-name-or-number]

set -e

# Ensure we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository" >&2
    exit 1
fi

# Get all worktrees
mapfile -t WORKTREES < <(git worktree list | awk '{print $1}')

if [[ ${#WORKTREES[@]} -eq 0 ]]; then
    echo "No worktrees found"
    exit 1
fi

# If argument provided, try to match it
if [[ -n "$1" ]]; then
    # Check if it's a number
    if [[ "$1" =~ ^[0-9]+$ ]]; then
        INDEX=$(($1 - 1))
        if [[ $INDEX -ge 0 ]] && [[ $INDEX -lt ${#WORKTREES[@]} ]]; then
            TARGET="${WORKTREES[$INDEX]}"
        else
            echo "Invalid worktree number: $1" >&2
            exit 1
        fi
    else
        # Try to match by path substring
        for WT in "${WORKTREES[@]}"; do
            if [[ "$WT" == *"$1"* ]]; then
                TARGET="$WT"
                break
            fi
        done
        if [[ -z "$TARGET" ]]; then
            echo "No worktree matching: $1" >&2
            exit 1
        fi
    fi
else
    # Interactive selection
    echo "Select worktree:"
    echo ""
    for i in "${!WORKTREES[@]}"; do
        WT="${WORKTREES[$i]}"
        BRANCH=$(git worktree list | grep "^${WT}" | awk '{print $3}' | tr -d '[]')
        CURRENT=""
        if [[ "$WT" == "$(pwd)" ]]; then
            CURRENT=" <- current"
        fi
        printf "%d) %-50s %s%s\n" $((i+1)) "$WT" "$BRANCH" "$CURRENT"
    done
    echo ""
    read -p "Enter number: " SELECTION

    if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [[ "$SELECTION" -lt 1 ]] || [[ "$SELECTION" -gt ${#WORKTREES[@]} ]]; then
        echo "Invalid selection" >&2
        exit 1
    fi

    TARGET="${WORKTREES[$((SELECTION-1))]}"
fi

# Output the cd command (to be eval'd by shell function)
# The script can't change the parent shell's directory directly
echo "cd \"$TARGET\""
echo ""
echo "# Run: eval \$(wt-switch.sh $1)"
echo "# Or add this shell function to your ~/.bashrc or ~/.zshrc:"
echo "#"
echo "# wt() {"
echo "#     local result"
echo "#     result=\$(wt-switch.sh \"\$@\" 2>&1)"
echo "#     if [[ \$? -eq 0 ]]; then"
echo "#         eval \"\$(echo \"\$result\" | head -1)\""
echo "#     else"
echo "#         echo \"\$result\""
echo "#     fi"
echo "# }"

#!/usr/bin/env bash
# Claude Code Auto-Sync Hook
# Pure hook executor - runs automatically on session start/end
# NO MANUAL COMMANDS - hooks and skills handle everything
#
# This script is called by Claude Code hooks, not by users directly.
# See: .claude/skills/icloud-sync/skill.md for intelligent operations

set -euo pipefail

# Configuration
ICLOUD_SYNC_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Claude-Code-Sessions"
LOCAL_CLAUDE_DIR="$HOME/.claude"
HOSTNAME=$(hostname -s)

# Environment detection
IS_REMOTE=false
IS_ICLOUD_AVAILABLE=false

[[ -n "${CLAUDE_REMOTE:-}" || -n "${SSH_CLIENT:-}" || -n "${SSH_TTY:-}" || -f "/.dockerenv" || -n "${CODESPACE_NAME:-}" || -n "${GITPOD_WORKSPACE_ID:-}" ]] && IS_REMOTE=true
[[ -d "$HOME/Library/Mobile Documents/com~apple~CloudDocs" ]] && IS_ICLOUD_AVAILABLE=true

# Git-based sync for remote environments
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_SYNC_DIR="$SCRIPT_DIR/../.claude-sessions"

# Select sync mode
if [[ "$IS_REMOTE" == "true" ]] || [[ "$IS_ICLOUD_AVAILABLE" == "false" ]]; then
    SYNC_MODE="git"
    SYNC_DIR="$GIT_SYNC_DIR"
else
    SYNC_MODE="icloud"
    SYNC_DIR="$ICLOUD_SYNC_DIR"
fi

# Ensure directories exist
mkdir -p "$SYNC_DIR/$HOSTNAME/projects" 2>/dev/null || true

# Log to sync dir (viewable by skill)
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$HOSTNAME] [$SYNC_MODE] $1" >> "$SYNC_DIR/.sync.log" 2>/dev/null || true
}

# === HOOK: SessionStart ===
# Imports sessions from other machines
hook_start() {
    log "SessionStart hook triggered"

    # Git mode: pull first
    if [[ "$SYNC_MODE" == "git" ]] && [[ -d "$SCRIPT_DIR/../.git" ]]; then
        pushd "$SCRIPT_DIR/.." > /dev/null
        git pull --rebase --quiet 2>/dev/null || true
        popd > /dev/null
    fi

    # Import from other machines (non-destructive)
    for machine_dir in "$SYNC_DIR"/*/; do
        [[ ! -d "$machine_dir" ]] && continue
        local machine_name=$(basename "$machine_dir")
        [[ "$machine_name" == "$HOSTNAME" ]] && continue
        [[ ! -d "$machine_dir/projects" ]] && continue

        mkdir -p "$LOCAL_CLAUDE_DIR/projects" 2>/dev/null || true
        rsync -a --ignore-existing "$machine_dir/projects/" "$LOCAL_CLAUDE_DIR/projects/" 2>/dev/null || true
    done

    log "SessionStart complete"
}

# === HOOK: SessionEnd ===
# Exports sessions to sync directory
hook_end() {
    log "SessionEnd hook triggered"

    local export_dir="$SYNC_DIR/$HOSTNAME"

    # Export projects (incremental)
    if [[ -d "$LOCAL_CLAUDE_DIR/projects" ]]; then
        rsync -a --update "$LOCAL_CLAUDE_DIR/projects/" "$export_dir/projects/" 2>/dev/null || true
    fi

    # Export metadata
    cp "$LOCAL_CLAUDE_DIR/history.jsonl" "$export_dir/" 2>/dev/null || true
    date +%Y%m%d_%H%M%S > "$export_dir/.last_sync"

    # Git mode: push changes
    if [[ "$SYNC_MODE" == "git" ]] && [[ -d "$SCRIPT_DIR/../.git" ]]; then
        pushd "$SCRIPT_DIR/.." > /dev/null
        git add ".claude-sessions/" 2>/dev/null || true
        git commit -m "sync: sessions from $HOSTNAME [auto]" --quiet 2>/dev/null || true
        git push --quiet 2>/dev/null || true
        popd > /dev/null
    fi

    log "SessionEnd complete"
}

# === AUTO-SETUP ===
# Installs hooks if not present (runs once, silently)
auto_setup() {
    local settings_file="$HOME/.claude/settings.json"
    local script_path=$(realpath "$0")

    # Check if already installed
    if [[ -f "$settings_file" ]] && grep -q "$script_path" "$settings_file" 2>/dev/null; then
        return 0  # Already installed
    fi

    # Ensure settings file exists
    [[ ! -f "$settings_file" ]] && mkdir -p "$(dirname "$settings_file")" && echo '{}' > "$settings_file"

    # Install hooks using jq (silent)
    if command -v jq &>/dev/null; then
        local new_settings=$(jq --arg start "$script_path start" --arg end "$script_path end" '
            .hooks = (.hooks // {}) |
            .hooks.SessionStart = ((.hooks.SessionStart // []) | map(select(. != $start)) + [$start]) |
            .hooks.SessionEnd = ((.hooks.SessionEnd // []) | map(select(. != $end)) + [$end])
        ' "$settings_file")
        echo "$new_settings" > "$settings_file"
        log "Auto-setup: hooks installed"
    fi
}

# === MAIN ===
# Only accepts hook commands - no manual operations
case "${1:-}" in
    start)
        hook_start
        ;;
    end)
        hook_end
        ;;
    _setup)
        # Hidden: called by skill for initial setup
        auto_setup
        echo "Hooks installed for: $HOSTNAME"
        echo "Sync mode: $SYNC_MODE"
        echo "Sync dir: $SYNC_DIR"
        ;;
    *)
        # Auto-setup on any other invocation, then show status
        auto_setup
        echo "Claude Code Auto-Sync"
        echo "====================="
        echo "Machine: $HOSTNAME"
        echo "Mode: $SYNC_MODE"
        echo "Sync: $SYNC_DIR"
        echo ""
        echo "This runs automatically via hooks."
        echo "Use the icloud-sync skill for intelligent operations."
        ;;
esac

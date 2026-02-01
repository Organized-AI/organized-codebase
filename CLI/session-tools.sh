#!/usr/bin/env bash
# Claude Code Session Tools
# Cross-machine session management for Claude Code
# Uses mcporter for memory MCP access

set -euo pipefail

# Configuration
CLAUDE_PROJECTS="$HOME/.claude/projects"
SHARED_SESSIONS="$(dirname "$0")"  # This folder syncs via iCloud
MEMORY_MCP="memory"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

# List all sessions across all projects
list_sessions() {
    local days="${1:-7}"
    echo -e "${BLUE}=== Claude Code Sessions (last $days days) ===${NC}"
    echo ""

    find "$CLAUDE_PROJECTS" -name "sessions-index.json" -mtime -"$days" 2>/dev/null | while read index; do
        local project_dir=$(dirname "$index")
        local project_name=$(basename "$project_dir" | sed 's/-/\//g' | sed 's/^\/Users//')

        echo -e "${YELLOW}Project:${NC} $project_name"

        jq -r '.entries[] | "  \(.created[0:10]) | \(.messageCount) msgs | \(.firstPrompt[0:60])..."' "$index" 2>/dev/null || continue
        echo ""
    done
}

# Search session content
search_sessions() {
    local query="$1"
    local project="${2:-}"

    echo -e "${BLUE}=== Searching for: '$query' ===${NC}"
    echo ""

    local search_path="$CLAUDE_PROJECTS"
    if [[ -n "$project" ]]; then
        search_path=$(find "$CLAUDE_PROJECTS" -type d -name "*${project}*" 2>/dev/null | head -1)
    fi

    find "$search_path" -name "*.jsonl" -type f 2>/dev/null | while read session; do
        local matches=$(grep -l "$query" "$session" 2>/dev/null || true)
        if [[ -n "$matches" ]]; then
            local project_dir=$(dirname "$session")
            local session_id=$(basename "$session" .jsonl)

            echo -e "${GREEN}Found in:${NC} $session_id"
            grep -n "$query" "$session" 2>/dev/null | head -3 | while read line; do
                echo "  $line" | cut -c1-120
            done
            echo ""
        fi
    done
}

# Export sessions to shared folder (syncs via iCloud)
sync_sessions() {
    local project="${1:-}"

    if [[ -z "$project" ]]; then
        log_info "Syncing all recent sessions to shared folder..."

        find "$CLAUDE_PROJECTS" -name "*.jsonl" -mtime -7 -type f 2>/dev/null | while read session; do
            local session_name=$(basename "$session")
            local project_name=$(basename "$(dirname "$session")")
            local dest_dir="$SHARED_SESSIONS/$project_name"

            mkdir -p "$dest_dir"
            cp "$session" "$dest_dir/"
        done

        # Also copy sessions-index.json files
        find "$CLAUDE_PROJECTS" -name "sessions-index.json" -mtime -7 -type f 2>/dev/null | while read index; do
            local project_name=$(basename "$(dirname "$index")")
            mkdir -p "$SHARED_SESSIONS/$project_name"
            cp "$index" "$SHARED_SESSIONS/$project_name/"
        done

        log_success "Sessions synced to: $SHARED_SESSIONS"
    else
        local project_dir=$(find "$CLAUDE_PROJECTS" -type d -name "*${project}*" 2>/dev/null | head -1)
        if [[ -d "$project_dir" ]]; then
            local project_name=$(basename "$project_dir")
            mkdir -p "$SHARED_SESSIONS/$project_name"
            cp "$project_dir"/*.jsonl "$SHARED_SESSIONS/$project_name/" 2>/dev/null || true
            cp "$project_dir/sessions-index.json" "$SHARED_SESSIONS/$project_name/" 2>/dev/null || true
            log_success "Synced: $project_name"
        else
            log_error "Project not found: $project"
        fi
    fi
}

# Show session summary
show_session() {
    local session_id="$1"

    local session_file=$(find "$CLAUDE_PROJECTS" -name "${session_id}.jsonl" 2>/dev/null | head -1)

    if [[ -z "$session_file" ]]; then
        # Also check shared folder
        session_file=$(find "$SHARED_SESSIONS" -name "${session_id}.jsonl" 2>/dev/null | head -1)
    fi

    if [[ -f "$session_file" ]]; then
        echo -e "${BLUE}=== Session: $session_id ===${NC}"
        echo ""

        # Count messages
        local msg_count=$(wc -l < "$session_file")
        echo "Messages: $msg_count"
        echo ""

        # Show first user message
        echo -e "${YELLOW}First prompt:${NC}"
        jq -r 'select(.type == "human" or .role == "user") | .content // .message' "$session_file" 2>/dev/null | head -10
        echo ""

        # Show recent messages
        echo -e "${YELLOW}Recent activity:${NC}"
        tail -5 "$session_file" | jq -r '.content // .message // .display' 2>/dev/null | head -20
    else
        log_error "Session not found: $session_id"
    fi
}

# Store learning in memory MCP
store_learning() {
    local entity="$1"
    local observation="$2"

    if command -v mcporter &>/dev/null; then
        # Check if entity exists
        local exists=$(mcporter call "memory.search_nodes(query: \"$entity\")" 2>/dev/null | jq '.entities | length')

        if [[ "$exists" == "0" ]]; then
            # Create new entity
            mcporter call "memory.create_entities(entities: [{\"name\": \"$entity\", \"entityType\": \"learning\", \"observations\": [\"$observation\"]}])" 2>/dev/null
            log_success "Created entity: $entity"
        else
            # Add observation to existing entity
            mcporter call "memory.add_observations(observations: [{\"entityName\": \"$entity\", \"contents\": [\"$observation\"]}])" 2>/dev/null
            log_success "Added observation to: $entity"
        fi
    else
        log_error "mcporter not installed. Run: npm install -g mcporter"
    fi
}

# Search memory
search_memory() {
    local query="$1"

    if command -v mcporter &>/dev/null; then
        echo -e "${BLUE}=== Memory Search: '$query' ===${NC}"
        mcporter call "memory.search_nodes(query: \"$query\")" 2>&1 | jq '.'
    else
        log_error "mcporter not installed"
    fi
}

# Read all memory
read_memory() {
    if command -v mcporter &>/dev/null; then
        echo -e "${BLUE}=== Knowledge Graph ===${NC}"
        mcporter call 'memory.read_graph()' 2>&1 | jq '.'
    else
        log_error "mcporter not installed"
    fi
}

# Help
show_help() {
    cat << 'EOF'
Claude Code Session Tools
==========================

Cross-machine session management for Claude Code.
Sessions sync via iCloud through the .claude-sessions folder.

COMMANDS:

  list [days]              List sessions from last N days (default: 7)
  search <query> [project] Search session content
  show <session-id>        Show session summary
  sync [project]           Export sessions to shared folder (iCloud sync)

Memory MCP (via mcporter):

  store <entity> <observation>  Store learning in memory graph
  memory-search <query>         Search knowledge graph
  memory-read                   Read entire knowledge graph

EXAMPLES:

  # List recent sessions
  ./session-tools.sh list
  ./session-tools.sh list 30

  # Search for content
  ./session-tools.sh search "disk space"
  ./session-tools.sh search "Lume" "Clawdbot"

  # Sync sessions to shared folder
  ./session-tools.sh sync
  ./session-tools.sh sync "Clawdbot"

  # Store a learning
  ./session-tools.sh store "LumeInstallation" "Use Homebrew-first approach"

  # Search memory
  ./session-tools.sh memory-search "Lume"

SETUP FOR CROSS-MACHINE SYNC:

  1. This folder (.claude-sessions) syncs via iCloud
  2. Run 'sync' on each machine to export local sessions
  3. Sessions from other machines appear after iCloud sync

EOF
}

# Main
case "${1:-help}" in
    list)
        list_sessions "${2:-7}"
        ;;
    search)
        search_sessions "${2:-}" "${3:-}"
        ;;
    show)
        show_session "${2:-}"
        ;;
    sync)
        sync_sessions "${2:-}"
        ;;
    store)
        store_learning "${2:-}" "${3:-}"
        ;;
    memory-search)
        search_memory "${2:-}"
        ;;
    memory-read)
        read_memory
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

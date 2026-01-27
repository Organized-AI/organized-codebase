#!/usr/bin/env bash
# apply-organized-codebase.sh
# Applies the Organized Codebase template to any project
# Version: 2.0 (Just integration)

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script location (for finding templates)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$(dirname "$SCRIPT_DIR")/templates"

echo -e "${BLUE}"
echo "═══════════════════════════════════════════════════════════════"
echo "  Organized Codebase Applicator v2.0"
echo "  with Just scaffolding integration"
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Usage information
usage() {
    echo "Usage: $0 [OPTIONS] [TARGET_DIR]"
    echo ""
    echo "Options:"
    echo "  -j, --just-only     Only copy justfile (skip direct scaffolding)"
    echo "  -f, --full          Full scaffolding (run justfile recipes)"
    echo "  -h, --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                  # Apply to current directory"
    echo "  $0 /path/to/project # Apply to specific directory"
    echo "  $0 -j               # Just copy the justfile"
    echo "  $0 -f               # Full setup with Just execution"
}

# Check if Just is installed
check_just() {
    if command -v just &> /dev/null; then
        echo -e "${GREEN}✅ Just is installed${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Just is not installed${NC}"
        echo ""
        echo "Install Just with one of these methods:"
        echo "  macOS:   brew install just"
        echo "  Linux:   cargo install just"
        echo "  Windows: winget install casey.just"
        echo ""
        echo "Or visit: https://github.com/casey/just#installation"
        return 1
    fi
}

# Copy justfile template
copy_justfile() {
    local target_dir="$1"

    if [ -f "$TEMPLATE_DIR/justfile" ]; then
        if [ -f "$target_dir/justfile" ]; then
            echo -e "${YELLOW}⚠️  justfile already exists. Backing up to justfile.bak${NC}"
            cp "$target_dir/justfile" "$target_dir/justfile.bak"
        fi
        cp "$TEMPLATE_DIR/justfile" "$target_dir/justfile"
        echo -e "${GREEN}✅ Copied justfile template${NC}"
    else
        echo -e "${RED}❌ Template justfile not found at: $TEMPLATE_DIR/justfile${NC}"
        exit 1
    fi
}

# Direct scaffolding (fallback when Just not available)
direct_scaffold() {
    local target_dir="$1"

    echo -e "${BLUE}📁 Creating directory structure...${NC}"

    # Create .claude structure
    mkdir -p "$target_dir/.claude"/{agents,commands,hooks,skills}
    echo "  Created .claude/"

    # Create documentation directories
    mkdir -p "$target_dir/PLANNING"/{implementation-phases,decisions,experiments}
    mkdir -p "$target_dir/ARCHITECTURE"
    mkdir -p "$target_dir/DOCUMENTATION"
    mkdir -p "$target_dir/SPECIFICATIONS"
    mkdir -p "$target_dir/AGENT-HANDOFF"
    mkdir -p "$target_dir/CONFIG"
    mkdir -p "$target_dir/scripts"
    mkdir -p "$target_dir/.archive"
    mkdir -p "$target_dir/.ralphy"

    echo "  Created PLANNING/, ARCHITECTURE/, DOCUMENTATION/, etc."

    echo -e "${GREEN}✅ Directory structure created${NC}"
}

# Main execution
main() {
    local target_dir="."
    local just_only=false
    local full_mode=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -j|--just-only)
                just_only=true
                shift
                ;;
            -f|--full)
                full_mode=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                target_dir="$1"
                shift
                ;;
        esac
    done

    # Resolve target directory
    target_dir="$(cd "$target_dir" 2>/dev/null && pwd)" || {
        echo -e "${RED}❌ Target directory does not exist: $target_dir${NC}"
        exit 1
    }

    echo -e "${BLUE}Target directory: $target_dir${NC}"
    echo ""

    # Step 1: Copy justfile
    copy_justfile "$target_dir"

    # Step 2: Check Just installation
    if check_just; then
        if [ "$just_only" = true ]; then
            echo ""
            echo -e "${GREEN}Done! Run these commands in your project:${NC}"
            echo "  just              # See available recipes"
            echo "  just apply-organized  # Apply full structure"
        elif [ "$full_mode" = true ]; then
            echo ""
            echo -e "${BLUE}Running: just apply-organized${NC}"
            (cd "$target_dir" && just apply-organized)
        else
            echo ""
            echo -e "${GREEN}Justfile copied! Run these commands in your project:${NC}"
            echo "  just                   # See available recipes"
            echo "  just apply-organized   # Apply full structure"
            echo "  just add-claude        # Just add .claude/"
            echo "  just add-planning      # Just add PLANNING/"
            echo "  just add-handoff       # Just add AGENT-HANDOFF/"
            echo "  just add-ralphy        # Just add .ralphy/"
        fi
    else
        echo ""
        echo -e "${YELLOW}Falling back to direct scaffolding...${NC}"
        direct_scaffold "$target_dir"

        echo ""
        echo -e "${GREEN}Done! Structure created.${NC}"
        echo ""
        echo "Recommendation: Install Just for better workflow:"
        echo "  brew install just  # macOS"
        echo ""
        echo "Then run: just apply-organized"
    fi

    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

main "$@"

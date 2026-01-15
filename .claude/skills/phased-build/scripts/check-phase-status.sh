#!/bin/bash
# Check phase status for a project with phased implementation

# Default phases directory
PHASES_DIR="${1:-PLANNING/implementation-phases}"

if [ ! -d "$PHASES_DIR" ]; then
    echo "Error: Phases directory not found: $PHASES_DIR"
    echo "Usage: $0 [phases-directory]"
    exit 1
fi

echo "=== Phase Status ==="
echo ""

# Find all phase prompts
PROMPTS=$(ls "$PHASES_DIR"/PHASE-*-PROMPT.md 2>/dev/null | sort -V)
COMPLETES=$(ls "$PHASES_DIR"/PHASE-*-COMPLETE.md 2>/dev/null | sort -V)

if [ -z "$PROMPTS" ]; then
    echo "No phase prompts found in $PHASES_DIR"
    exit 1
fi

# Count phases
TOTAL_PHASES=$(echo "$PROMPTS" | wc -l | tr -d ' ')
COMPLETED_PHASES=$(echo "$COMPLETES" | grep -c "COMPLETE" 2>/dev/null || echo "0")

echo "Total phases: $TOTAL_PHASES"
echo "Completed: $COMPLETED_PHASES"
echo ""
echo "| Phase | Name | Status |"
echo "|-------|------|--------|"

for prompt in $PROMPTS; do
    # Extract phase number
    PHASE_NUM=$(echo "$prompt" | grep -o 'PHASE-[0-9]*' | sed 's/PHASE-//')

    # Extract phase name from first heading
    PHASE_NAME=$(head -5 "$prompt" | grep "^# Phase" | sed 's/^# Phase [0-9]*: //' | head -1)
    [ -z "$PHASE_NAME" ] && PHASE_NAME="Unknown"

    # Check if complete file exists
    COMPLETE_FILE="$PHASES_DIR/PHASE-${PHASE_NUM}-COMPLETE.md"
    if [ -f "$COMPLETE_FILE" ]; then
        STATUS="Completed"
    else
        STATUS="Pending"
    fi

    echo "| $PHASE_NUM | $PHASE_NAME | $STATUS |"
done

echo ""

# Determine next phase
NEXT_PHASE=""
for prompt in $PROMPTS; do
    PHASE_NUM=$(echo "$prompt" | grep -o 'PHASE-[0-9]*' | sed 's/PHASE-//')
    COMPLETE_FILE="$PHASES_DIR/PHASE-${PHASE_NUM}-COMPLETE.md"
    if [ ! -f "$COMPLETE_FILE" ]; then
        NEXT_PHASE=$PHASE_NUM
        break
    fi
done

if [ -n "$NEXT_PHASE" ]; then
    echo "Next: Phase $NEXT_PHASE"
    echo "Run: Read PLANNING/implementation-phases/PHASE-${NEXT_PHASE}-PROMPT.md"
else
    echo "All phases complete!"
fi

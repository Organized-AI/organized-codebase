#!/bin/bash

# Script to copy Organized Codebase CONFIG files to target directory
# Target: /Users/jordaaan/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Windsurf/Organized Codebase/CONFIG

TARGET_DIR="/Users/jordaaan/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Windsurf/Organized Codebase/CONFIG"

# Create target directory if it doesn't exist
echo "Creating target directory..."
mkdir -p "$TARGET_DIR"

# Copy all markdown files
echo "Copying configuration files..."

cp /home/claude/CLAUDE_CODE_9_AGENT_SYSTEM.md "$TARGET_DIR/"
cp /home/claude/PROJECT_OVERVIEW_AND_QA_CHECKLIST.md "$TARGET_DIR/"
cp /home/claude/DEVCONTAINER_INTEGRATION.md "$TARGET_DIR/"
cp /home/claude/ARCHITECTURE.md "$TARGET_DIR/"
cp /home/claude/README_CONFIG.md "$TARGET_DIR/"

echo "Files copied successfully to: $TARGET_DIR"
echo ""
echo "Files copied:"
ls -lh "$TARGET_DIR"

echo ""
echo "✅ Setup complete! Your Organized Codebase CONFIG directory is ready."

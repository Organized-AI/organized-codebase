#!/bin/bash

# Setup cron job for token tracker (runs every hour)
# This script installs the hourly token tracking automation

set -e

echo "🔧 Setting up hourly token tracker cron job..."

# Get the absolute path to the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRACKER_SCRIPT="$SCRIPT_DIR/update-token-tracker.js"

# Check if script exists
if [ ! -f "$TRACKER_SCRIPT" ]; then
    echo "❌ Error: Token tracker script not found at $TRACKER_SCRIPT"
    exit 1
fi

# Copy script to ~/.claude/scripts/ for global access
GLOBAL_SCRIPT="$HOME/.claude/scripts/update-token-tracker.js"
mkdir -p "$HOME/.claude/scripts"
cp "$TRACKER_SCRIPT" "$GLOBAL_SCRIPT"
chmod +x "$GLOBAL_SCRIPT"

# Create cron job entry using global script path
CRON_JOB="0 * * * * /usr/bin/env node \"$GLOBAL_SCRIPT\" >> ~/.claude/logs/token-tracker.log 2>&1"

# Create log directory
mkdir -p ~/.claude/logs

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "update-token-tracker.js"; then
    echo "⚠️  Cron job already exists, updating script location..."
    # Remove old cron job
    crontab -l 2>/dev/null | grep -v "update-token-tracker.js" | crontab -
fi

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
echo "✅ Cron job installed successfully!"
echo "   Script: $GLOBAL_SCRIPT"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Token Tracker Setup Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Token usage will be tracked hourly in:"
echo "   ~/.claude/token-tracker.json"
echo ""
echo "📝 Logs available at:"
echo "   ~/.claude/logs/token-tracker.log"
echo ""
echo "🔍 View current usage:"
echo "   cat ~/.claude/token-tracker.json | jq ."
echo ""
echo "🗑️  To remove cron job:"
echo "   crontab -e  # then delete the update-token-tracker.js line"
echo ""
echo "▶️  Run manually now:"
echo "   node $TRACKER_SCRIPT"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

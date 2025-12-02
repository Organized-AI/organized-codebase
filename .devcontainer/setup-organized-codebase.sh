#!/bin/bash

# Organized Codebase DevContainer Setup Script
# Runs automatically when the DevContainer is created
# This script prepares the environment and offers Claude Agent SDK automation

set -e

echo "🚀 Setting up Organized Codebase Development Environment..."

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Check if Python requirements exist
if [ -f "requirements.txt" ]; then
    echo "🐍 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Set up git configuration (if not already configured)
if [ -z "$(git config --global user.name)" ]; then
    echo "⚙️  Git not configured. You can configure it later with:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
fi

# Create necessary directories if they don't exist
mkdir -p .claude/agents
mkdir -p logs
mkdir -p data

echo "✅ DevContainer setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 CLAUDE AGENT SDK AUTOMATION AVAILABLE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This project includes Claude Agent SDK for intelligent automation."
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 📝 Fill out your PLANNING documents:"
echo "   - PLANNING/01-project-brief.md"
echo "   - PLANNING/02-requirements.md"
echo "   - PLANNING/03-architecture.md"
echo ""
echo "2. 🤖 Run the Setup Agent to automate configuration:"
echo "   npm run agent:setup"
echo ""
echo "   The agent will:"
echo "   ✓ Analyze your planning documents"
echo "   ✓ Configure your tech stack"
echo "   ✓ Set up dependencies"
echo "   ✓ Generate initial project structure"
echo "   ✓ Create development scripts"
echo ""
echo "3. 🚀 Or manually continue with:"
echo "   - Update .env with your API keys"
echo "   - Customize package.json dependencies"
echo "   - Review AGENT-HANDOFF instructions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Pro Tip: The Setup Agent can save you 30-60 minutes of manual configuration!"
echo ""

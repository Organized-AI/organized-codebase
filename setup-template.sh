#!/bin/bash

# Organized Codebase Template Setup Script
# This script helps set up the template structure for a new project

set -e  # Exit on any error

echo "🚀 Setting up Organized Codebase Template..."

# Get project name from user
if [ -z "$1" ]; then
    read -p "Enter your project name: " PROJECT_NAME
else
    PROJECT_NAME="$1"
fi

# Validate project name
if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Error: Project name cannot be empty"
    exit 1
fi

echo "📁 Creating project directory: $PROJECT_NAME"

# Get the script's directory (Organized Codebase location)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Set target directory to parent Windsurf directory
TARGET_DIR="$(dirname "$SCRIPT_DIR")/$PROJECT_NAME"

# Create project directory in the Windsurf parent directory
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

echo "📋 Creating directory structure..."

# Create all necessary directories
mkdir -p PLANNING
mkdir -p ARCHITECTURE
mkdir -p DOCUMENTATION
mkdir -p SPECIFICATIONS
mkdir -p AGENT-HANDOFF
mkdir -p PROJECT-FILES
mkdir -p ITERATIONS/v1-mvp
mkdir -p ITERATIONS/v2-enhancements
mkdir -p ITERATIONS/v3-scaling

echo "📝 Copying template files..."

# Copy template files from the organized-codebase repository
# Note: This assumes you have the organized-codebase template available

# Use the Organized Codebase directory as the template source
TEMPLATE_DIR="$SCRIPT_DIR"

# Copy all template files
cp -r "$TEMPLATE_DIR"/PLANNING/* PLANNING/ 2>/dev/null || echo "⚠️  Planning templates not found"
cp -r "$TEMPLATE_DIR"/ARCHITECTURE/* ARCHITECTURE/ 2>/dev/null || echo "⚠️  Architecture templates not found"
cp -r "$TEMPLATE_DIR"/DOCUMENTATION/* DOCUMENTATION/ 2>/dev/null || echo "⚠️  Documentation templates not found"
cp -r "$TEMPLATE_DIR"/SPECIFICATIONS/* SPECIFICATIONS/ 2>/dev/null || echo "⚠️  Specifications templates not found"
cp -r "$TEMPLATE_DIR"/AGENT-HANDOFF/* AGENT-HANDOFF/ 2>/dev/null || echo "⚠️  Agent handoff templates not found"
cp -r "$TEMPLATE_DIR"/PROJECT-FILES/* PROJECT-FILES/ 2>/dev/null || echo "⚠️  Project files not found"

# Copy DevContainer configuration
cp -r "$TEMPLATE_DIR"/.devcontainer . 2>/dev/null && echo "✅ Copied DevContainer configuration" || echo "⚠️  DevContainer not found"

# Copy automation scripts
mkdir -p scripts
cp -r "$TEMPLATE_DIR"/scripts/* scripts/ 2>/dev/null && echo "✅ Copied automation scripts" || echo "⚠️  Scripts not found"

# Copy CONFIG documentation (optional - for reference)
cp -r "$TEMPLATE_DIR"/CONFIG . 2>/dev/null && echo "✅ Copied CONFIG documentation" || echo "⚠️  CONFIG not found"

# Copy README and other root files
cp "$TEMPLATE_DIR"/README.md . 2>/dev/null || echo "⚠️  README template not found"

echo "🔧 Customizing templates with project name..."

# Replace placeholder project names in files
find . -name "*.md" -type f -exec sed -i.bak "s/\[Your Project Name\]/$PROJECT_NAME/g" {} \;
find . -name "*.md" -type f -exec sed -i.bak "s/your-project-name/$PROJECT_NAME/g" {} \;

# Clean up backup files created by sed
find . -name "*.bak" -delete

echo "📦 Setting up environment file..."

# Copy .env.example from template root
if [ -f "$TEMPLATE_DIR/.env.example" ]; then
    cp "$TEMPLATE_DIR/.env.example" .env.example
    cp "$TEMPLATE_DIR/.env.example" .env
    echo "✅ Created .env.example and .env files"
    echo "⚠️  Remember to update .env with your ANTHROPIC_API_KEY and other values"
else
    echo "⚠️  No .env.example found in template"
fi

echo "📄 Creating additional project files..."

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    cat > package.json << EOL
{
  "name": "$(echo $PROJECT_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '-')",
  "version": "1.0.0",
  "description": "$PROJECT_NAME - Built with Organized Codebase Template",
  "main": "index.js",
  "scripts": {
    "dev": "echo 'Add your development server command here'",
    "build": "echo 'Add your build command here'",
    "test": "echo 'Add your test command here'",
    "start": "echo 'Add your start command here'",
    "agent:setup": "node scripts/setup-agent.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.1"
  },
  "devDependencies": {},
  "keywords": [],
  "author": "",
  "license": "MIT"
}
EOL
    echo "✅ Created package.json template with Claude Agent SDK"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOL
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database
*.sqlite
*.db

# Temporary files
tmp/
temp/
EOL
    echo "✅ Created .gitignore file"
fi

echo "🎯 Initializing git repository..."

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit: Add Organized Codebase Template structure

- Added planning documents (project brief, requirements, architecture, user stories, roadmap)
- Added architecture documentation (system design, data models, tech stack)
- Added specifications (functional specs, technical specs, testing strategy)
- Added agent handoff instructions (coding instructions, file structure, dependencies, completion checklist)
- Added project configuration files and templates
- Set up development environment structure

Ready for feature development and AI agent handoff."
    echo "✅ Git repository initialized with initial commit"
else
    echo "ℹ️  Git repository already exists"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Template setup complete for: $PROJECT_NAME"
echo "📁 Project location: $(pwd)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 QUICK START OPTIONS:"
echo ""
echo "Option 1: Manual Setup (Traditional)"
echo "  1. 📝 Fill out PLANNING/01-project-brief.md"
echo "  2. 📋 Complete PLANNING/02-requirements.md"
echo "  3. 🏗️  Define PLANNING/03-architecture.md"
echo "  4. 🔧 Update .env with your API keys"
echo "  5. 📦 Run: npm install"
echo ""
echo "Option 2: 🤖 AI-POWERED SETUP (Recommended!)"
echo "  1. 📝 Fill out PLANNING/01-project-brief.md (basic info)"
echo "  2. Set your API key: export ANTHROPIC_API_KEY='your-key'"
echo "  3. Run: npm install"
echo "  4. Run: npm run agent:setup"
echo "  5. ✨ Let Claude Agent SDK configure everything!"
echo ""
echo "Option 3: DevContainer (Isolated Environment)"
echo "  1. Open folder in VS Code"
echo "  2. Click 'Reopen in Container'"
echo "  3. Container auto-configures with Node 20, Python 3.11"
echo "  4. Run: npm run agent:setup"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Pro tip: Option 2 (AI-powered) can save 30-60 minutes!"
echo "📚 For help: https://github.com/Organized-AI/organized-codebase"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

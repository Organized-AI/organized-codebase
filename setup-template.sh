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

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

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

# Check if we're in the template directory or need to download it
if [ ! -f "../organized-codebase/README.md" ]; then
    echo "📥 Downloading template from GitHub..."
    git clone https://github.com/Organized-AI/organized-codebase.git temp-template
    TEMPLATE_DIR="temp-template"
else
    TEMPLATE_DIR="../organized-codebase"
fi

# Copy all template files
cp -r "$TEMPLATE_DIR"/PLANNING/* PLANNING/ 2>/dev/null || echo "⚠️  Planning templates not found"
cp -r "$TEMPLATE_DIR"/ARCHITECTURE/* ARCHITECTURE/ 2>/dev/null || echo "⚠️  Architecture templates not found"
cp -r "$TEMPLATE_DIR"/DOCUMENTATION/* DOCUMENTATION/ 2>/dev/null || echo "⚠️  Documentation templates not found"
cp -r "$TEMPLATE_DIR"/SPECIFICATIONS/* SPECIFICATIONS/ 2>/dev/null || echo "⚠️  Specifications templates not found"
cp -r "$TEMPLATE_DIR"/AGENT-HANDOFF/* AGENT-HANDOFF/ 2>/dev/null || echo "⚠️  Agent handoff templates not found"
cp -r "$TEMPLATE_DIR"/PROJECT-FILES/* PROJECT-FILES/ 2>/dev/null || echo "⚠️  Project files not found"

# Copy README and other root files
cp "$TEMPLATE_DIR"/README.md . 2>/dev/null || echo "⚠️  README template not found"

# Clean up temporary template if we downloaded it
if [ "$TEMPLATE_DIR" = "temp-template" ]; then
    rm -rf temp-template
fi

echo "🔧 Customizing templates with project name..."

# Replace placeholder project names in files
find . -name "*.md" -type f -exec sed -i.bak "s/\[Your Project Name\]/$PROJECT_NAME/g" {} \;
find . -name "*.md" -type f -exec sed -i.bak "s/your-project-name/$PROJECT_NAME/g" {} \;

# Clean up backup files created by sed
find . -name "*.bak" -delete

echo "📦 Setting up environment file..."

# Create .env file from example
if [ -f "PROJECT-FILES/.env.example" ]; then
    cp PROJECT-FILES/.env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Remember to update .env with your actual configuration values"
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
    "start": "echo 'Add your start command here'"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
EOL
    echo "✅ Created package.json template"
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

echo "📋 Next Steps Checklist:"
echo ""
echo "1. 📝 Fill out PLANNING/01-project-brief.md with your project vision"
echo "2. 📋 Complete PLANNING/02-requirements.md with your feature requirements"
echo "3. 🏗️  Define your system architecture in PLANNING/03-architecture.md"
echo "4. 👥 Write user stories in PLANNING/04-user-stories.md"
echo "5. 🗓️  Create implementation timeline in PLANNING/05-implementation-roadmap.md"
echo "6. 🤖 Customize AGENT-HANDOFF/coding-instructions.md for your tech stack"
echo "7. 🔧 Update .env file with your actual configuration values"
echo "8. 📦 Update package.json with your dependencies and scripts"
echo "9. 🚀 Start development or hand off to your AI coding agent!"
echo ""
echo "🎉 Template setup complete for: $PROJECT_NAME"
echo "📁 Project location: $(pwd)"
echo ""
echo "💡 Pro tip: Start with PLANNING/01-project-brief.md to define your vision clearly"
echo "📚 For help: Check out https://github.com/Organized-AI/organized-codebase"

---
description: Create a new project from the Organized Codebase boilerplate
argument-hint: <project-name>
allowed-tools: Bash(bash:*)
---

Create a new project from the Organized Codebase template by running the setup script with project name: $ARGUMENTS

This will:
1. Run `setup-template.sh` with the provided project name
2. Create a new directory with the full template structure
3. Copy all planning, architecture, and documentation templates
4. Initialize git repository with initial commit
5. Set up package.json and .gitignore
6. Customize templates with your project name

The boilerplate remains unchanged - new project is created as a sibling directory.

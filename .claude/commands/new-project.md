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
7. If the project deploys a Cloudflare Worker (it has a `wrangler.jsonc`), run `just add-gitops` from the new project
   so it starts on GitOps: CI on every PR, staging on merge, production only through a "Deploy <sha> to production"
   pull request, an e2e suite before and after production, and logs and traces on. See
   `templates/gitops/cloudflare-workers/README.md`.

The boilerplate remains unchanged - new project is created as a sibling directory.

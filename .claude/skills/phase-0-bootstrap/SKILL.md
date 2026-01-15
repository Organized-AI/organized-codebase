---
name: phase-0-bootstrap
description: |
  Bootstrap or verify Phase 0 project setup for TypeScript/Node.js projects.
  Use when: (1) User asks to "bootstrap project", "initialize phase 0", "setup TypeScript project", or "verify phase 0", (2) User has CLAUDE-CODE-PHASE-0.md or PHASE-0-PROMPT.md file, (3) User wants to start a new phased build from scratch, (4) User asks "is phase 0 complete?" or "check project setup".
---

# Phase 0 Bootstrap

Bootstrap or verify Phase 0 project setup for TypeScript/Node.js projects.

## Decision Tree

```
Has PHASE-0-PROMPT.md or CLAUDE-CODE-PHASE-0.md?
├── Yes → Read and execute that file
└── No → Has package.json?
    ├── Yes → Verify existing setup
    └── No → Create from template (references/typescript-template.md)
```

## Workflow

### 1. Check Current State

```bash
# Check for existing Phase 0 prompt
ls PLANNING/implementation-phases/PHASE-0-PROMPT.md 2>/dev/null
ls CLAUDE-CODE-PHASE-0.md 2>/dev/null

# Check if already complete
ls PLANNING/implementation-phases/PHASE-0-COMPLETE.md 2>/dev/null

# Check for existing setup
ls package.json tsconfig.json 2>/dev/null
```

### 2a. Execute Existing Phase 0 Prompt

If `PHASE-0-PROMPT.md` or `CLAUDE-CODE-PHASE-0.md` exists:

1. Read the file
2. Read any context files listed
3. Execute all tasks in order
4. Run verification
5. Create completion doc
6. Git commit

### 2b. Verify Existing Setup

If `package.json` exists but no Phase 0 prompt:

```bash
# Verify core files exist
ls package.json tsconfig.json .gitignore

# Verify TypeScript compiles
npm run build
npm run typecheck

# Verify entry point runs
npx tsx src/index.ts
```

If all pass → Create PHASE-0-COMPLETE.md and commit.
If failures → Report what's missing, offer to fix.

### 2c. Create From Template

If no existing setup, use template from `references/typescript-template.md`:

1. Create package.json with standard scripts
2. Create tsconfig.json for ES2022/NodeNext
3. Install dependencies
4. Create directory structure
5. Create placeholder entry point
6. Run verification
7. Create completion doc
8. Git commit

## Verification Commands

Run these in sequence - all must pass:

```bash
npm install          # Dependencies install
npm run build        # TypeScript compiles to dist/
npm run typecheck    # No type errors
npx tsx src/index.ts # Entry point executes
```

## Completion Document

Create `PLANNING/implementation-phases/PHASE-0-COMPLETE.md`:

```markdown
# Phase 0: Project Setup - COMPLETE

**Completed:** [YYYY-MM-DD]

## Deliverables

- [x] package.json with build/dev/test scripts
- [x] tsconfig.json for TypeScript
- [x] Dependencies installed ([X] packages)
- [x] Directory structure (src/, tests/, logs/)
- [x] .env.example with required variables
- [x] .gitignore configured

## Verification

- npm install: [X] packages
- npm run build: No errors
- npm run typecheck: No errors
- npx tsx src/index.ts: Executed successfully

## Next Phase

Proceed to Phase 1: Core Infrastructure
- Read: `PLANNING/implementation-phases/PHASE-1-PROMPT.md`
```

## Git Commit

```bash
git add -A && git commit -m "$(cat <<'EOF'
Phase 0: Project setup complete - TypeScript initialized

- package.json with build/dev/test scripts
- tsconfig.json with ES2022 + NodeNext modules
- Dependencies installed
- Directory structure: src/, tests/, logs/

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

## Quick Status Check

```bash
# Run the status script
scripts/verify-phase-0.sh
```

## Resources

- `references/typescript-template.md` - Full template for new projects
- `scripts/verify-phase-0.sh` - Verification script

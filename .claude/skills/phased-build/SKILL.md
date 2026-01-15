---
name: phased-build
description: |
  Execute multi-phase software builds with structured prompts, verification, documentation, and git commits.
  Use when: (1) User has a PLANNING/implementation-phases/ folder with PHASE-X-PROMPT.md files, (2) User asks to "build through phases", "execute phase X", "continue with next phase", or "run phased build", (3) User wants automated build workflow with verification gates, completion docs, and git commits per phase.
---

# Phased Build

Execute implementation phases sequentially with verification gates, completion documentation, and git commits.

## Expected Project Structure

```
project/
├── PLANNING/
│   └── implementation-phases/
│       ├── PHASE-0-PROMPT.md    # Setup/initialization
│       ├── PHASE-1-PROMPT.md    # Core infrastructure
│       ├── PHASE-2-PROMPT.md    # ... subsequent phases
│       └── ...
├── src/                          # Code output directory
└── ...
```

## Workflow

### 1. Discovery

```bash
# Find all phase prompts
ls PLANNING/implementation-phases/PHASE-*-PROMPT.md

# Identify completed phases
ls PLANNING/implementation-phases/PHASE-*-COMPLETE.md
```

Determine current phase: highest N where PHASE-N-COMPLETE.md exists, then next = N+1.

### 2. Phase Execution Loop

For each phase N:

**a) Read the prompt:**
```
Read PLANNING/implementation-phases/PHASE-N-PROMPT.md
```

**b) Read context files** listed in the prompt (if any):
```
## Context Files to Read
DOCUMENTATION/IMPLEMENTATION-SPEC.md
rules/safety-guardrails.json
...
```

**c) Execute all tasks** listed under `## Tasks` section.

**d) Run verification** from `## Success Criteria` or `## Test Verification`:
```bash
npm run build      # Must pass
npm run typecheck  # Must pass
npx tsx src/index.ts  # Run verification script
```

**e) Create completion document:**
```
PLANNING/implementation-phases/PHASE-N-COMPLETE.md
```

Use template from `references/completion-template.md`.

**f) Git commit:**
```bash
git add -A && git commit -m "$(cat <<'EOF'
Phase N: [Phase name] complete

- [Key deliverable 1]
- [Key deliverable 2]
- [Key deliverable 3]

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

**g) Push to remote** (if configured):
```bash
git push origin main
```

### 3. Continue or Stop

After each phase:
- If more PHASE-X-PROMPT.md files exist: continue to next phase
- If user requested specific phase(s): stop after completing requested range
- If errors occur: stop, report, and wait for user guidance

## Phase Prompt Structure

Each PHASE-X-PROMPT.md should contain:

```markdown
# Phase X: [Name]

## Objective
[1-2 sentences describing the goal]

## Prerequisites
- Phase X-1 complete
- [Other requirements]

## Context Files to Read
[List of files providing context]

## Tasks
### 1. [Task Name]
[Description and code/instructions]

### 2. [Task Name]
...

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Test Verification
[Code or commands to verify success]

## Completion
[Instructions for completion doc and git commit]
```

## Commands

| User Request | Action |
|--------------|--------|
| "Run phase 3" | Execute only Phase 3 |
| "Continue from phase 2" | Execute Phase 2 through final |
| "Build all phases" | Execute Phase 0 through final |
| "Check phase status" | List completed vs pending phases |

## Error Handling

| Error Type | Action |
|------------|--------|
| Build fails | Stop, show error, suggest fix |
| Type errors | Fix errors, re-run verification |
| Test fails | Analyze failure, fix, re-verify |
| Phase prompt missing | Report missing file, stop |

## Resources

- `references/completion-template.md` - Template for PHASE-X-COMPLETE.md files
- `scripts/check-phase-status.sh` - Quick status check script

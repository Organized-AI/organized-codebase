---
name: boris-ablation
description: |
  Run a controlled re-baseline of CLAUDE.md, hooks, skills, and other harness layers after a model upgrade.
  Use when the project feels over-prompted, stale, brittle, or when a new model generation changes what the scaffold should do.
metadata:
  version: 1.0.0
  author: Organized Codebase
  source: DOCUMENTATION/BORIS-DELETE-YOUR-CLAUDE-MD-GUIDE.md
  integrates_with:
    - ablate (command)
    - outcome-prompt (command)
    - boris (skill)
    - boris-pi-harness-companion (skill)
triggers:
  - "ablate"
  - "rebaseline"
  - "new model"
  - "prompt bloat"
  - "stale claude.md"
  - "stale hooks"
  - "stale skills"
---

# Boris Ablation Skill

Use this skill to **prune stale project instructions without losing safety**.

## Core thesis

Model capability changes faster than most scaffolds do.

That means `CLAUDE.md`, hooks, skills, and harness prompts should be treated as **hypotheses**, not scripture.

## Non-negotiable evaluation rule

- **Tests protect code correctness.**
- **Evals protect methodology correctness.**

Run both before deciding what to prune.

Default companions:
- `DOCUMENTATION/BORIS-ABLATION-EVAL-MATRIX.md`
- `DOCUMENTATION/BORIS-ABLATION-SCORECARD-TEMPLATE.md`

## Keep vs prune

### Keep by default
- permissions and safety boundaries
- verification commands
- tests / build checks / static analysis
- reproducible evals
- artifact-based evidence collection

### Candidates for deletion
- long prose that restates obvious behavior
- workarounds for older models
- duplicated guidance spread across multiple files
- hooks nobody can explain anymore
- giant context blobs with no measurable effect

## Ablation workflow

### 1. Choose representative tasks
Pick 2-4 real tasks:
- one routine task
- one moderate feature or refactor
- one task that previously needed careful steering

### 2. Create a safe experiment branch
Never ablate on the main branch.

### 3. Inventory the harness
Capture current state of:
- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/hooks/`
- `.claude/skills/`
- `.claude/commands/`
- any project-specific prompt layers

### 4. Remove one optional layer at a time
Order:
1. optional prompt prose
2. optional skills
3. optional hooks
4. optional helper scaffolding

### 5. Re-run the chosen tasks
For each task, record:
- result quality
- failure mode
- whether failure repeated
- whether the failure was actually a context/tooling problem

If the project uses multiple harnesses or model routes, run the same task pack across the relevant routes before deleting a global layer.

### 6. Add back the smallest winning delta
Prefer this order:
1. shorter instruction
2. better verification surface
3. better tool / MCP access
4. a focused skill
5. only then more persistent prompt text

### 7. Document the delta
Log:
- what stayed deleted
- what had to return
- what became shorter
- what became a tool or skill instead of prompt prose

## Decision questions

Before reintroducing anything, ask:
1. Does it fix a **repeated** failure?
2. Is it cheaper than solving the problem with tooling or verification?
3. Is it short enough to justify reading every session?
4. Can this be encoded as a skill instead of prompt tax?

## What success looks like

A successful ablation yields:
- smaller `CLAUDE.md`
- fewer stale hooks
- more focused skills
- better verification surfaces
- higher confidence that remaining instructions actually matter

If a layer only helps one route (for example a Pi/local harness), success may mean **moving** it into a companion skill instead of deleting it globally.

## Deliverable template

```md
## Re-baseline summary
- tasks tested:
- layers removed:
- layers restored:
- layers still deleted:
- repeated failure modes:
- recommendations for next model upgrade:
```

## Strong recommendation

If the current request is implementation-heavy, pair this skill with `/outcome-prompt` first so the ablation tests a clean, outcome-first brief rather than a bloated one.

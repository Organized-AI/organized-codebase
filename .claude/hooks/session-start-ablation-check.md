---
name: session-start-ablation-check
description: |
  Optional SessionStart hook that asks whether the current model generation still needs the existing CLAUDE.md, hooks, and skills.
  Designed to trigger re-baselining after model upgrades or long periods without scaffold review.
trigger: SessionStart
condition: Project uses Boris methodology and a model upgrade or scaffold drift is suspected
version: 1.0.0
---

# Session Start Ablation Check Hook

## Purpose

Catch prompt and harness drift early.

This hook exists to prevent teams from carrying forward stale `CLAUDE.md` instructions, stale hooks, or stale skills just because they used to be necessary.

## What it should do

At session start, the hook should:
1. Read the current project scaffold (`CLAUDE.md`, `.claude/settings.json`, `.claude/hooks/`, `.claude/skills/`)
2. Check whether the team recently changed models or upgraded Claude Code
3. Prompt the operator to run `/ablate` when the scaffold looks stale
4. Point the agent toward outcome-first prompts and verification surfaces instead of adding more prose

## Suggested checks

- Has the primary model changed since the last documented ablation?
- Is `CLAUDE.md` significantly larger than the last known-good version?
- Are there hooks or skills that nobody has touched in a long time?
- Are repeated failures being solved with more prompt text instead of better tests/tools?

## Suggested output

```text
BORIS ABLATION CHECK
- Current scaffold: present
- Model change detected: yes/no
- Ablation recommended: yes/no
- Next action: /ablate or continue
```

## When to trigger a recommendation

Recommend `/ablate` when:
- a new model generation lands
- prompt files have grown materially
- the same instruction appears in multiple places
- recent sessions show prompt cargo-culting
- long tasks are failing for lack of verification, not lack of prose

## Important boundary

This hook should **recommend** re-baselining.
It should not automatically delete files or rewrite the scaffold.

## Best companion artifacts

- `/ablate`
- `/outcome-prompt`
- `boris-ablation` skill
- `verification-surface-designer` skill

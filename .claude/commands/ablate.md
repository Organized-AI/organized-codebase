---
description: Re-baseline CLAUDE.md, hooks, and skills after a model upgrade (Boris ablation workflow)
---

# /ablate

Run a **controlled ablation** of project instructions and harness layers.

Use this when:
- a new model release lands
- Claude feels over-constrained or oddly brittle
- `CLAUDE.md`, hooks, or skills have grown stale
- the team wants evidence for which instructions still matter

## Goal

Strip the scaffold back to the smallest safe baseline, rerun real tasks, and add back only the **smallest deltas that repeated failures prove are still necessary**.

> This is not "delete documentation forever." It is **measure → prune → reintroduce only what earns its keep**.

## Before you delete anything

Use both:
- **tests** to protect code correctness
- **evals** to protect methodology correctness

Recommended companion docs:
- `DOCUMENTATION/BORIS-ABLATION-EVAL-MATRIX.md`
- `DOCUMENTATION/BORIS-ABLATION-SCORECARD-TEMPLATE.md`

If you cannot show that a layer no longer improves outcomes across the relevant task pack, model route, and harness, do not delete it yet.

## Inputs to gather first

1. **Representative tasks**
   - Pick 2-4 tasks that reflect real usage.
   - Include at least one routine task and one non-trivial task.

2. **Current scaffold inventory**
   - `CLAUDE.md`
   - active hooks / hook docs
   - project skills
   - command docs
   - agents / verification tools

3. **Baseline evidence**
   - current output quality
   - failure modes you already know about
   - verification commands that prove success
   - ablation scorecard for comparing variants

## Procedure

### Step 1 — Freeze a safety baseline

Create a feature branch first.

Then save copies of:
- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/hooks/`
- `.claude/skills/`
- any task-specific prompt docs

Do **not** start by deleting safety, permissions, or verification infrastructure.

### Step 2 — Classify what is sacred vs optional

**Keep by default:**
- permissions / safety boundaries
- verification commands
- build/test checks
- static analysis
- reproducible evals

**Ablate aggressively:**
- long prompt prose
- stale workaround instructions
- hooks that nobody can justify anymore
- skills that duplicate model-native behavior
- harness code added for old-model weaknesses

### Step 3 — Remove one layer at a time

Ablate in this order:
1. optional `CLAUDE.md` guidance
2. optional skills
3. optional hooks
4. optional helper prompts / harness instructions

Never remove multiple layers at once unless you are explicitly testing a full reset.

### Step 4 — Re-run the representative tasks

For each task, capture:
- what improved
- what regressed
- what failed repeatedly
- whether the failure is due to missing context, missing tooling, or missing verification

If the repo supports multiple harnesses or model routes, re-run the same task pack across the relevant routes before deleting a global layer.

### Step 5 — Reintroduce only the smallest winning delta

If the model fails:
- prefer a **shorter instruction** over a longer one
- prefer a **tool / MCP / test surface** over more prose
- prefer a **skill** over repeating the same long guidance every session
- prefer a **verification surface** over implementation micromanagement

### Step 6 — Record conclusions

Document:
- what was removed
- what stayed removed
- what had to come back
- what changed because of the current model generation
- what should be checked again at the next model upgrade

## Output format

Return a short ablation report:

```md
## Ablation Report
- Model tested:
- Tasks used:
- Removed:
- Re-added:
- Stayed deleted:
- New failure modes:
- Recommendation:
```

## Decision rules

Keep an instruction only if it passes all three tests:
1. **Repeatedly needed**
2. **Short enough to justify its token cost**
3. **Better than solving the problem with tooling or verification**

If the layer only helps a Pi/local/custom harness route, move it into a companion skill rather than keeping it global.

## Anti-patterns

- Do **not** delete permissions and call that progress.
- Do **not** preserve bloated prompts out of nostalgia.
- Do **not** re-add five paragraphs when one sentence or one test would do.
- Do **not** confuse a one-off stumble with a true repeated failure.

## Recommended follow-up

If the ablation reveals missing structure, create or update:
- a focused skill
- a hook with a narrow purpose
- a verification surface
- a trimmed `CLAUDE.md` section

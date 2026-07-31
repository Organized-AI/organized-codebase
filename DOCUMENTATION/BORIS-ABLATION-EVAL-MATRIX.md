# Boris Ablation Eval Matrix

This document answers the practical question behind Boris-style pruning:

> How do we know how much and what to delete?

Short answer: **not by instinct**.

You delete only after a matrix of **tests + evals** shows that an instruction, hook, skill, or harness layer no longer improves outcomes.

---

## Core rule

- **Tests protect code correctness.**
- **Evals protect methodology correctness.**

You need both.

### Tests tell you
- did the repo still build?
- did the code still pass lint/typecheck?
- did the behavior still satisfy unit/integration checks?

### Evals tell you
- did removing this scaffold layer change agent outcomes?
- did the model need this instruction across multiple tasks?
- did a different harness/model make the same layer useful or unnecessary?

---

## What should never be deleted blindly

Treat these as **invariants** until evidence says otherwise:
- permissions and safety boundaries
- build/test commands
- static analysis and type checks
- reproducible eval runners
- evidence requirements / verification surfaces
- protected-path rules in custom harnesses

These are not prompt bloat. They are the safety rails that let you prune aggressively elsewhere.

---

## What belongs in the ablation matrix

An ablation matrix should vary the optional scaffold while holding the task pack steady.

### Recommended axes

#### 1) Model
Examples:
- GPT-5.4
- Claude Sonnet / Opus
- local model route

#### 2) Harness
Examples:
- plain Claude Code / default tool loop
- Organized Codebase baseline
- Pi harness
- local verifier/critic harness

#### 3) Scaffold variant
Examples:
- full scaffold
- reduced `CLAUDE.md`
- no optional hooks
- no optional skill X
- shorter outcome-first prompt

#### 4) Task pack
Use the same representative tasks for each run:
- one routine maintenance task
- one medium implementation/refactor task
- one task that previously required steering
- optional long-running or multi-step task

#### 5) Verification surface
Record what proved success:
- tests
- build
- screenshots
- smoke checks
- artifact diffs
- reviewer/verifier pass

---

## Minimum evaluation procedure

### Step 1 — Freeze the benchmark task pack
Choose 3-6 tasks that represent real use.

Good task packs include:
- docs change with verification
- small feature or refactor
- bugfix with tests
- multi-file change with reviewer pass
- optional harness-specific task

### Step 2 — Define the baseline
Run the full current scaffold first.

Capture:
- completion status
- test/build pass status
- evidence quality
- number of retries / restarts
- token/time cost if available
- notable failure modes

### Step 3 — Remove one optional layer
Examples:
- trim one `CLAUDE.md` section
- disable one optional hook
- remove one skill from the workflow
- replace long prose with outcome + guardrails + verification

Never change multiple optional layers at once unless you are explicitly measuring a full reset.

### Step 4 — Re-run the same task pack
Compare against baseline on:
- pass rate
- correctness
- verification completeness
- intervention required
- cost / latency
- regression shape

### Step 5 — Decide
Delete the layer only if:
1. outcomes stay the same or improve
2. evidence quality does not regress materially
3. failures do not increase across relevant models/harnesses
4. the removed layer is not required by another route in the matrix

---

## Recommended scorecard fields

For each run, record:
- model
- harness
- scaffold variant
- task id
- task type
- verification surface used
- completed: yes/no
- tests/build/lint status
- evidence quality: high/medium/low
- human intervention level: none/light/heavy
- failure mode summary
- keep/delete decision for the changed layer

Use `DOCUMENTATION/BORIS-ABLATION-SCORECARD-TEMPLATE.md` as the default results sheet.

---

## Decision rules

### Safe to delete
Delete when a layer is:
- redundant across all relevant routes
- a workaround for an older model
- replaced by stronger tooling/evals
- not improving task outcomes in the matrix

### Keep conditionally
Keep when a layer helps only:
- a weaker model
- a specific harness
- a risky task class
- a route with weaker verification surfaces

If that happens, move it into a **companion skill or harness-specific layer** instead of keeping it global.

### Keep globally
Keep globally only when the layer improves outcomes across:
- multiple tasks
- multiple runs
- multiple models/harnesses that matter

---

## Why harness-specific logic should stay separate

Boilerplate repos often serve multiple execution routes.

A rule that is useful for a Pi harness may be unnecessary or even harmful for plain Claude Code.

So prefer:
- **Boris core** = model/harness-agnostic methodology
- **Companion skill** = route-specific harness logic

That keeps the base scaffold lighter while still supporting local/Pi routes.

---

## Example matrix row

| Variant | Model | Harness | Tasks | Pass Rate | Evidence Quality | Intervention | Decision |
|---|---|---|---:|---:|---|---|---|
| Full scaffold | GPT-5.4 | baseline | 4 | 4/4 | High | Light | baseline |
| Trimmed `CLAUDE.md` | GPT-5.4 | baseline | 4 | 4/4 | High | Light | delete old section |
| No hook X | GPT-5.4 | baseline | 4 | 4/4 | High | None | delete hook X |
| No Pi harness helper | Sonnet | Pi harness | 4 | 2/4 | Medium | Heavy | keep in companion skill |

---

## Bottom line

Boris-style deletion is only safe when it is grounded in:
- stable task packs
- real verification
- cross-route evals
- repeatable scorecards

If you cannot show that a layer still matters, it should be a deletion candidate.
If you cannot show that deletion is safe, it should stay until you can evaluate it properly.

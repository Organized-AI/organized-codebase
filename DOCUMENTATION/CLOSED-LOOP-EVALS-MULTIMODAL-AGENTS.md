# Closed-Loop Evals for Multimodal Agents — What Organized Codebase Should Copy from Uber

This guide ingests the July 24, 2026 AI Engineer talk **“Building Closed-Loop Evals for a Multimodal Agent at Scale”** and translates it into Organized Codebase operator guidance.

The useful takeaway is **not** “copy Uber’s image pipeline.”

It is this:

> a real eval loop is not just a prompt plus a judge.
>
> it is a staged system with gold data, explicit guardrails, replayable failures, diagnosers, promotion gates, rollback, and live feedback routed back into the next version.

That is exactly the kind of pattern Organized Codebase should teach when users want more than a one-off `/verify` pass.

---

## Source packet

### Primary source
- **AI Engineer:** [Building Closed-Loop Evals for a Multimodal Agent at Scale — Soumya Gupta & Jai Chopra, Uber](https://www.youtube.com/watch?v=31GUkCBD-Uc)
- **Published:** 2026-07-24
- **Duration:** 21m 38s

### Local ingest artifacts
- YouTube metadata: `/tmp/uber_closed_loop_eval_ingest/yt_info.json`
- Transcript source: native YouTube transcript API via Hermes helper
- Transcript: `/tmp/uber_closed_loop_eval_ingest/transcript_api.txt`
- Local MP4: `/tmp/uber_closed_loop_eval_ingest/31GUkCBD-Uc.mp4`

### TwelveLabs ingest
- Index: `AI Youtube Videos` (`6a2a035fb3fb171ccfaf8a40`)
- TwelveLabs video ID: `6a6e954fc1ac59f5d1e0463a`
- TwelveLabs task status: `ready`
- TwelveLabs analysis: `/tmp/uber_closed_loop_eval_ingest/twelvelabs_analysis.md`
- Ingest state: `/tmp/uber_closed_loop_eval_ingest/state.json`

### Grounding note
This write-up is grounded in the talk transcript, YouTube metadata/description, and a successful TwelveLabs ingest + analysis pass. Any repo recommendations below are Organized Codebase synthesis on top of that source, not claims that Uber itself uses this repo structure.

---

## Executive takeaway

Uber’s talk gives a concrete definition of a closed-loop eval system:

1. **start with a staged production workflow** rather than one giant judge,
2. **attach the right metric to each stage**,
3. **treat human labels as the offline alignment source**,
4. **sample production drift continuously**,
5. **route failures into a diagnoser + tuning pipeline**,
6. **re-benchmark before promotion**,
7. **keep rollback and observability ready when the loop misfires**.

For Organized Codebase, the durable lesson is:

> if a repo wants to support eval loops, it should ship reusable surfaces for stage design, rubric design, replay, diagnosis, promotion, and rollback — not just a generic “judge this output” command.

---

## The system shape from the talk

Uber’s example is food-image enhancement, but the control structure generalizes well.

### Stage 1 — Understand and route
At `5:21–8:30`, the talk describes an image-understanding + routing stage:
- inspect multimodal input,
- produce structured output,
- grade against a rubric,
- decide whether to **enhance** or **skip**.

This stage is evaluated like a classifier:
- confusion matrix,
- precision / recall,
- and possibly multi-branch routing accuracy when several downstream paths exist.

### Stage 2 — Generate and repair in a loop
At `5:45–6:16` and `13:23–14:37`, the editing agent:
- generates an edit,
- sends it through QA,
- takes QA feedback,
- retries for up to **K** iterations,
- then either publishes or gives up.

The key metric here is **pass@k**, not just single-shot success.

### Stage 3 — Publish-ready QA
At `17:39–18:23`, Uber adds a final publish gate with additional policy and quality checks.

This is important because they explicitly accept some redundancy.
They describe the design as a **Swiss cheese model**: several imperfect gates layered so one miss does not automatically hit production.

### Stage 4 — Drift capture and auto-tuning
At `11:07–13:14` and `18:36–20:24`, the system becomes truly closed-loop:
- sample real production cases,
- relabel using the same rubric/guidelines,
- compare agent output vs. gold output,
- run an umbrella diagnoser,
- trigger config/prompt/system tuning,
- benchmark again,
- only then promote the next version.

That is the part Organized Codebase should pay closest attention to.

---

## What this means for Organized Codebase

Organized Codebase already has strong verification language.
This talk sharpens what an **eval loop layer** should add beyond `/verify`.

### 1. Treat eval loops as multi-stage workflows, not monolithic judge prompts
A good OC eval loop should declare:
- the stage being evaluated,
- the artifact under judgment,
- the judge/rubric for that stage,
- the retry behavior,
- the promotion criteria,
- and the fallback/rollback behavior.

That means an eval loop belongs naturally in:
- a planning/spec surface,
- a command surface,
- and a documentation surface.

### 2. Separate offline alignment from online drift handling
The talk is very clear about this distinction.

Offline:
- gather representative data,
- label it with objective guidelines,
- benchmark until guardrails pass.

Online:
- sample production,
- replay flagged examples,
- detect mismatch,
- diagnose,
- retune,
- benchmark before promotion.

OC should make that split explicit instead of treating “evals” as one undifferentiated bucket.

### 3. Each stage should have its own metric
The talk does **not** use one universal quality score.
Instead it uses stage-local measures:
- **recall** for routing guardrails (`9:36–10:41`),
- **pass@k** for iterative enhancement (`14:00–15:08`),
- pairwise or rubric-based quality checks for final judgment (`14:56–15:45`),
- marketplace/product metrics like conversion for live impact (`20:27–21:13`).

OC should teach users to attach metrics to the stage that can actually move them.

### 4. Diagnosers are first-class eval infrastructure
The most reusable architectural idea in the talk is the **diagnoser** abstraction (`11:23–11:31`, `18:55–19:38`).

The diagnoser:
- takes in failures from different loops,
- localizes which agent/config/stage is responsible,
- routes the issue to the right tuning path,
- and keeps the whole system from becoming a pile of ad hoc fixes.

For Organized Codebase, this suggests:
- diagnoser agents,
- replay packs for flagged cases,
- and config-driven tuning surfaces that can be updated without rewriting the whole workflow.

### 5. Logging is not “nice to have” scaffolding
At `6:17–7:07`, they make a strong point that logging comes first because without it you cannot optimize or even form a self-learning loop.

That is a direct fit with Boris-style evidence requirements.
An OC eval loop should record:
- inputs,
- outputs,
- judge results,
- rubric scores,
- retries,
- final disposition,
- promotion decision,
- and rollback handle.

If a loop cannot explain why it promoted or rejected a version, it is not production-ready.

---

## Repo-shaped recommendations

### What Organized Codebase should ship first

### A. An eval-loop spec template
The repo should give maintainers one place to specify:
- stage,
- gold set,
- judges,
- rubric dimensions,
- thresholds,
- retry rules,
- promotion gates,
- rollback,
- and online feedback intake.

See: `PLANNING/spec-templates/eval-loop.md`

### B. A reusable eval-loop playbook doc
This document should live as evergreen operator guidance:
- when to use a loop,
- how to pick stage metrics,
- how to structure diagnoser workflows,
- and how to keep online feedback from degenerating into prompt churn.

This file is that playbook seed.

### C. A command surface for replay + benchmark
The talk repeatedly relies on replaying examples and re-benchmarking before shipping.

OC should likely grow commands such as:
- `/eval-replay`
- `/eval-benchmark`
- `/eval-promote`
- `/eval-rollback`

Even if the repo does not ship all of those immediately, the workflow should be named explicitly.

### D. A diagnoser pattern
OC should document a diagnoser that answers:
- what failed,
- where it failed,
- whether the fix belongs in prompt/config/router/policy/judge,
- and whether the fix improved the relevant benchmark.

### E. A scorecard / rubric surface
The repo already discusses eval matrices and ablations.
This talk suggests adding a more operational rubric surface for live loops:
- objective label guidelines,
- stage-local scores,
- pass/fail thresholds,
- and evidence links for each verdict.

---

## What to copy

- **Stage-specific metrics, not one global grade**
- **Human-labeled gold sets for initial alignment**
- **Replay of flagged production cases before promotion**
- **Diagnoser layer above individual agents/judges**
- **Config-driven tuning instead of opaque prompt thrash**
- **Pass@k for iterative repair loops**
- **Redundant gates for high-cost failures**
- **Rollback-ready deployment after auto-tuning**
- **Audit-friendly logging from day one**

## What not to cargo-cult

- Do not copy the exact Uber domain rubric into unrelated tasks.
- Do not assume “fully automated tuning” is safe for every repo or risk class.
- Do not use production/product metrics as a substitute for stage-level correctness checks.
- Do not treat more loops as automatically better; every extra loop must justify its latency and complexity.
- Do not collapse diagnosis, tuning, benchmarking, and promotion into one opaque agent step.

---

## Suggested operator rules for OC eval loops

### Use an eval loop when all are true
- the task has recurring failure modes,
- the output can be judged against explicit criteria,
- production drift matters,
- and version promotion needs more than a one-off smoke test.

### Avoid a heavy eval loop when any are true
- the task is rare or one-shot,
- there is no credible judge or gold set,
- retry cost exceeds failure cost,
- or the real need is simpler verification rather than adaptive tuning.

### Require these invariants
- explicit rubric
- replayable examples
- benchmark before promotion
- rollback path
- evidence/logging trail
- clear owner for human override

---

## Evidence anchors from the talk

- `5:21–6:16` — staged pipeline: understand → route → enhance → QA → publish
- `6:17–7:07` — logging as prerequisite for optimization and self-learning loops
- `7:32–8:30` — rubric-based routing + classifier-style evaluation
- `8:54–9:34` — human labels as golden source and ship/no-ship guardrails
- `9:36–10:41` — recall prioritized to prevent bad cases slipping through
- `11:07–11:31` — production sampling + mismatch detection + umbrella diagnoser
- `12:19–13:14` — reflect + synthesize tuning path and benchmark-before-registering
- `13:43–15:08` — QA feedback loop and pass@k framing
- `15:33–17:35` — faithfulness/completeness/reward-hacking/object-coherence failure modes
- `17:53–18:23` — publish-ready final QA with layered redundancy
- `18:36–20:24` — multiple feedback loops routed through a higher-level diagnoser
- `20:27–21:13` — product/market metrics used after, not instead of, stage-level evals

---

## Bottom line

Organized Codebase should define closed-loop evals as:

> **staged verification + replayable failures + diagnoser-driven tuning + benchmarked promotion**

—not as “ask a judge model if it looks good.”

If the repo ships only one new eval-loop primitive from this source, it should be this:

> **a reusable eval-loop spec that forces maintainers to name the stage, rubric, thresholds, replay path, promotion gate, and rollback path up front.**

---
initiative: {slug}
type: project
issue_type: feature
status: draft
priority: medium
github_issue: null
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
phases:
  - id: p1
    name: "Define stage, rubric, and gold set"
    tasks:
      - "Identify the exact stage being evaluated"
      - "Write objective scoring guidance"
      - "Assemble baseline / golden examples"
    test_cases:
      - id: "eval-gold-set-loads"
        description: "Golden dataset and rubric can be loaded by the loop runner"
        type: "smoke"
  - id: p2
    name: "Implement replay + judge path"
    tasks:
      - "Wire judge(s), evidence capture, and retry behavior"
      - "Define thresholds and failure dispositions"
    test_cases:
      - id: "eval-replay-produces-verdict"
        description: "A replay run returns stage verdicts, scores, and evidence"
        type: "integration"
  - id: p3
    name: "Add promotion, rollback, and drift handling"
    tasks:
      - "Define benchmark gate before promotion"
      - "Define rollback handle and online feedback ingestion"
    test_cases:
      - id: "eval-promotion-is-gated"
        description: "A candidate cannot promote unless thresholds pass"
        type: "integration"
---

# {Eval Loop Title}

> GitHub Issue: [#{N}](https://github.com/{org}/{repo}/issues/{N})

## Overview

{1-3 sentences explaining what recurring failure or quality problem this eval loop is meant to control, why verification alone is not enough, and what production decision this loop should influence.}

## Loop Scope

### Target Stage
- **Stage name:** {routing | generation | qa | review | publish gate | other}
- **Artifact under judgment:** {what the loop evaluates}
- **Upstream inputs:** {prompts, specs, diffs, screenshots, metadata, traces, etc.}
- **Downstream decision:** {retry | promote | reject | escalate | rollback | other}

### Why This Needs a Loop
- {What drifts or repeats over time}
- {Why a one-shot `/verify` pass is insufficient}
- {What is expensive if this fails in production}

## Gold Set and Feedback Sources

### Offline Alignment Set
- **Source:** {where the benchmark examples come from}
- **Representativeness:** {how you cover the long tail, segments, or known hard cases}
- **Labeling guidance:** {how labels stay objective and repeatable}
- **Refresh cadence:** {weekly/monthly/on release/etc.}

### Online Feedback Inputs
- {thumbs up/down, bug reports, benchmark drift, human review, production incidents, etc.}
- {who can submit them}
- {how they become replayable cases}

## Judge Stack

### Primary Judges
| Judge | Role | Input | Output | Failure mode to watch |
|---|---|---|---|---|
| {judge-1} | {classifier / rubric scorer / verifier / reviewer} | {input} | {score/verdict} | {known weakness} |
| {judge-2} | {role} | {input} | {output} | {weakness} |

### Human-in-the-Loop Points
- {Where humans define gold truth}
- {Where humans review borderline or high-risk cases}
- {Where humans must approve promotion or rollback}

## Rubric Dimensions and Thresholds

| Dimension | What it means here | Score shape | Pass threshold | Notes |
|---|---|---|---|---|
| {faithfulness} | {definition} | {yes/no, 1-5, pairwise, etc.} | {threshold} | {notes} |
| {quality} | {definition} | {shape} | {threshold} | {notes} |
| {safety} | {definition} | {shape} | {threshold} | {notes} |

### Stage Metric
- **Primary metric:** {recall | precision | pass@k | pairwise win rate | error rate | other}
- **Why this metric fits this stage:** {explain why this is the right control metric}
- **What metric should NOT drive this stage:** {common wrong proxy}

## Retry / Repair Loop

### Loop Mechanics
1. {Run target stage}
2. {Judge the result}
3. {Capture evidence and failure reasons}
4. {Retry/repair if allowed}
5. {Stop at K iterations or threshold breach}

### Retry Policy
- **Max iterations (K):** {number}
- **What changes between iterations:** {prompt, config, tool choice, agent route, etc.}
- **When to stop early:** {hard failure / policy trip / low confidence / cost cap}
- **Coverage tradeoff:** {what happens when the case never passes}

## Diagnoser and Tuning Path

### Diagnoser Questions
- Which stage actually failed?
- Was the problem in the builder, the judge, the rubric, the routing policy, or the data?
- Is this isolated noise or a systemic pattern?
- What config/prompt/policy change is being proposed?

### Tuning Path
- **Tunable surfaces:** {config, prompt, rubric, routing table, model selection, etc.}
- **Benchmark after tuning:** {what must re-run before promotion}
- **Registration/promotion handle:** {where the new version becomes active}

## Promotion and Rollback

### Promotion Gate
A candidate version may promote only if:
- {threshold 1}
- {threshold 2}
- {threshold 3}
- {evidence/logging requirement}

### Rollback Plan
- **Rollback trigger:** {what causes revert}
- **Rollback handle:** {git ref, config version, model alias, artifact ID, etc.}
- **Operator response:** {exact command or procedure}

## Logging and Evidence

Every loop run should capture:
- inputs
- outputs
- rubric scores/verdicts
- retry count
- final disposition
- benchmark result
- promotion/rollback reference
- links to screenshots, traces, diffs, or artifacts

## Non-Goals

Explicitly out of scope for this loop:
- {thing we are not trying to optimize}
- {thing we are not auto-tuning}
- {thing that still requires manual review}

## Open Questions

- [ ] {question about rubric, data, or thresholds}
- [ ] {question about promotion ownership}
- [ ] {question about online drift handling}

## Verification Strategy

### Benchmark Verification
{What benchmark command or runner must pass before promotion. Be specific.}

### Replay Verification
{How a fresh agent can replay known cases and inspect the evidence.}

### Safety Verification
{How you verify that the loop itself cannot promote unsafe or low-evidence changes.}

## Verification Plan

### VP1: Replay a known failure
1. `{command to run the loop on a flagged case}`
   Expected: {verdict, scores, evidence path}
2. `{command to inspect the evidence}`
   Expected: {specific file/output}

### VP2: Benchmark a candidate
1. `{benchmark command}`
   Expected: {threshold summary / pass gate}
2. `{promotion dry-run or report command}`
   Expected: {promote blocked or allowed with reason}

### VP3: Rollback a bad promotion
1. `{rollback command or config flip}`
   Expected: {prior version restored}
2. `{smoke check}`
   Expected: {system healthy after rollback}

## Implementation Hints

### Suggested Repo Surfaces
- `DOCUMENTATION/` for the playbook and operator notes
- `PLANNING/` for this spec
- `.claude/commands/` for replay / benchmark / promote commands
- `.claude/agents/` for diagnoser / judge / reviewer agents
- `scripts/` for deterministic runners and report generation

### Common Pitfalls
- optimizing one global score instead of stage-local metrics
- tuning on live incidents without replaying them against a stable benchmark
- promoting changes without a rollback handle
- letting the judge drift without auditing the rubric itself
- collecting feedback that never becomes a replayable case

### Reference Docs
- `DOCUMENTATION/CLOSED-LOOP-EVALS-MULTIMODAL-AGENTS.md` — source-grounded playbook from Uber’s multimodal eval talk
- `DOCUMENTATION/BORIS-ABLATION-EVAL-MATRIX.md` — tests + evals for scaffold decisions
- `DOCUMENTATION/GRAPH-ENGINEERING-VERIFICATION-PLAYBOOK.md` — stronger verification architecture for multi-agent workflows

---

<!-- Copy this template for each new eval loop.
     Fill every {placeholder}. Approved specs should retain no placeholder text. -->

---
initiative: {slug}
type: workflow
issue_type: graph
status: draft
priority: medium
github_issue: null
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
primary_goal: "{single-sentence outcome}"
judge_model_policy:
  build_nodes: "{cheap / mixed / strong}"
  judge_nodes: "{strong / strongest available}"
barriers:
  - id: b1
    name: "{barrier name}"
    required_nodes: ["{node-id}", "{node-id}"]
nodes:
  - id: n1
    name: "{node name}"
    kind: build
    objective: "{what this node does}"
    inputs:
      - "{input artifact}"
    outputs:
      - "{output artifact}"
    verification:
      - "{how this node proves correctness}"
    downstream:
      - "{node-id}"
  - id: n2
    name: "{node name}"
    kind: review
    objective: "{what this node judges}"
    inputs:
      - "{input artifact}"
    outputs:
      - "{review report}"
    verification:
      - "{how to know the review ran correctly}"
    downstream:
      - "{barrier-id or node-id}"
edges:
  - from: n1
    to: n2
    contract: "{what is passed and in what shape}"
failure_recovery:
  - "{what happens when a build node fails}"
  - "{what happens when a review node disagrees with another review node}"
---

# {Graph Workflow Title}

> Use this template when a task should be handled as a graph rather than a single linear loop.

## Summary

{1-3 sentences explaining why this task benefits from fan-out, what the critical risk is, and why a graph is better than a serial loop.}

## Why a Graph Here?

A graph is justified only if at least one of these is true:
- different work surfaces can run independently,
- multiple review angles are required before merge,
- or the cost of serial review is meaningfully higher than coordinated fan-out.

If none of those are true, do not use this template.

## Node Catalog

### N1 — {Node Name}
- **Kind:** build / review / synthesize / verify
- **Objective:** {what this node must accomplish}
- **Inputs:** {what artifacts it reads}
- **Outputs:** {what artifacts it emits}
- **Verification:** {how this node proves it did correct work}
- **Model policy:** {cheap / mixed / strong}
- **Failure mode to watch:** {most likely way this node goes wrong}

### N2 — {Node Name}
- **Kind:** build / review / synthesize / verify
- **Objective:** {objective}
- **Inputs:** {inputs}
- **Outputs:** {outputs}
- **Verification:** {verification}
- **Model policy:** {cheap / mixed / strong}
- **Failure mode to watch:** {failure mode}

_Add sections for every node._

## Edge Contracts

### E1 — {n1} → {n2}
- **Payload:** {what gets passed}
- **Contract:** {required format, fields, or assumptions}
- **Why it matters:** {how a weak handoff could corrupt downstream work}

_Add sections for every edge._

## Barrier Points

### B1 — {Barrier Name}
Wait for:
- {node-id}
- {node-id}

Proceed only when:
- all required nodes have completed,
- blocking verification has passed,
- and conflicting findings have been reconciled.

## Judge Strategy

Document explicitly:
- which nodes can use cheaper models,
- which nodes require stronger judge models,
- and where a weak judge would create fake rework or bad decisions.

## Verification Plan

### VP1: Node-local checks
1. `{command or observation}`
   Expected: {result}

### VP2: Barrier validation
1. `{command or review step}`
   Expected: {all required node outputs are present}

### VP3: Final synthesis check
1. `{command or review step}`
   Expected: {consolidated result reflects all required review angles}

## Failure Recovery

When something fails:
1. identify whether failure came from generation, handoff, or judgment,
2. retry only the failed node when possible,
3. re-run only the dependent downstream nodes,
4. re-open the barrier if any required evidence changed.

## Non-Goals

- {thing this graph will not attempt}
- {thing this workflow intentionally leaves to a serial command}

---

<!-- Fill every placeholder before using. A valid graph workflow spec must define:
1) nodes,
2) edges,
3) at least one verification surface,
4) barrier logic,
5) judge-model policy. -->

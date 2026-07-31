---
name: boris-pi-harness-companion
description: |
  Optional companion skill for running Boris methodology inside Pi/local custom harnesses.
  Use when scaffold decisions differ by model route, Pi harness, or local verifier/controller architecture.
metadata:
  version: 1.0.0
  author: Organized Codebase
  source: DOCUMENTATION/BORIS-DELETE-YOUR-CLAUDE-MD-GUIDE.md
  integrates_with:
    - boris (skill)
    - boris-ablation (skill)
    - verification-surface-designer (skill)
    - ablate (command)
triggers:
  - "pi harness"
  - "local harness"
  - "multi harness"
  - "model route"
  - "harness companion"
  - "route-specific scaffold"
---

# Boris Pi Harness Companion

This is an **optional companion layer**, not part of Boris core.

Use it when the repo must support:
- Pi agents
- local model routes
- custom controller/verifier loops
- multiple harnesses with different strengths and weaknesses

## Core principle

Keep Boris core harness-agnostic.

Put route-specific logic here when a rule is useful for:
- one model family
- one harness controller
- one verifier architecture
- one device/runtime path

Do **not** force Pi-specific scaffolding into the global Boris defaults unless the eval matrix proves it helps across the board.

## When to use this skill

Use this skill when:
- a weaker or local model needs more structure than cloud frontier models
- a Pi harness uses a controller/verifier loop that changes how tasks should be framed
- one harness needs different protected/editable path rules
- ablation results differ across model routes
- you need a sibling harness rather than changing the working harness in place

## What belongs here

### 1. Route-specific harness guidance
Examples:
- model routing and fallbacks
- verifier/controller expectations
- local sandbox constraints
- stricter editable/protected path boundaries

### 2. Harness-specific verification
Examples:
- trace files
- run ledgers
- score.json / verifier reports
- replayable task packs
- protected-path policy checks

### 3. Companion-only instructions
Examples:
- prompt shims for a weaker local model
- Pi-specific startup checks
- local endpoint or runner conventions
- deterministic mock-server verification before real model runs

## What should stay in Boris core

Keep these global unless evals prove otherwise:
- outcome-first prompting
- guardrails + exit criteria + verification
- test/build/lint expectations
- evidence-first completion
- controlled ablation mindset

## Recommended harness layout

```text
harnesses/<name>/
  harness.yaml
  README.md
  agents/
    orchestrator.md
    worker.md
    verifier.md
  model_routes.yaml
  tools.yaml
  permissions.yaml
  sandbox_policy.yaml
  tasks/
  runs/
  logs/
```

## Evaluation rule

If a layer helps only Pi/local routes, do not keep it global.

Instead:
1. record the result in the ablation scorecard
2. move the logic into this companion skill or a sibling harness
3. re-run the same task pack to prove the separation works

## Sibling-harness rule

When adapting to a new local model, prefer a **sibling harness** over mutating the canonical harness in place.

Copy only reusable surfaces:
- deterministic runner/verifier
- task pack
- prompt surface
- route config

Do not carry over stale run artifacts or historical outputs.

## Verification checklist

Before saying a Pi/local harness variant is good:
- run code correctness checks for the repo
- run the representative task pack
- capture traces / scores / verifier report
- compare against baseline in the ablation scorecard
- confirm which rules are core vs companion-only

## Decision rule

If a Pi-specific rule improves only Pi/local routes:
- keep it here
- do not push it into global Boris defaults

If it improves outcomes everywhere:
- promote it into Boris core after repeated matrix wins

## Strong pairing

Use this skill together with:
- `DOCUMENTATION/BORIS-ABLATION-EVAL-MATRIX.md`
- `DOCUMENTATION/BORIS-ABLATION-SCORECARD-TEMPLATE.md`
- `boris-ablation`
- `verification-surface-designer`

That gives you a clean split between:
- **core methodology**
- **route-specific harness adaptation**

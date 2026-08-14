# Organized Router

Organized Router is the **separate policy layer** for deciding when work should stay local, when it should use Claude, and when it should use Codex.

## Why this exists

The goal is not to make every model do everything.
The goal is to route each task to the **cheapest, safest, and strongest** harness that can do it well.

This follows the Organized Tokens and Organized Harness guidance:

- local orchestrator first
- stable task classes
- deterministic verification before model escalation
- frontier models only when the task really needs them

## Files

- `task-classes.json` — canonical task classes and legacy aliases
- `route-policies.json` — policy matrix by task class and harness
- `model-manifests.json` — lightweight model notes and capability hints

## Decision inputs

A route should consider:

- task class
- privacy boundary
- verification burden
- cost ceiling
- available harnesses
- whether deterministic tools can answer first

## Core rule

Keep Router separate from the core scaffold.
If a rule helps only one harness or one local model pairing, it belongs in that harness companion layer instead.

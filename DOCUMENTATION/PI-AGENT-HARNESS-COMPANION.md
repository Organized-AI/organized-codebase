# Pi Agent Harness Companion

This is the **opt-in local harness layer** for Organized Codebase.

The goal is not to pretend a Pi/local model is globally equivalent to a frontier model.
The goal is to let you spin up **task-specific sibling harnesses** that mimic a frontier model's:

- task decomposition
- output contract
- verifier posture
- refusal boundary
- escalation policy

## Separation rule

- Core Boris workflow stays global
- Codex surface stays under `.codex/`
- Router policy stays under `CONFIG/router/`
- Pi/local harness behavior stays under `harnesses/pi-agent/`

## Files

- `harnesses/pi-agent/frontier-pairings.json` — known local/frontier pairing presets
- `scripts/scaffold-pi-harness.js` — generate a sibling harness quickly

## Quick start

```bash
node scripts/scaffold-pi-harness.js \
  --name claude-qwen-research \
  --frontier claude-sonnet-4 \
  --local qwen3:8b
```

That creates `harnesses/claude-qwen-research/` with:

- pairing manifest
- orchestrator / worker / verifier role cards
- permissions
- sandbox policy
- task packet template
- eval rubric

## Frontier-paired harness principle

Mimic the frontier model's **operating shape**, not its exact prose.
A good companion harness should preserve:

- action schema
- routing thresholds
- verifier expectations
- allowed side effects
- escalation trigger to the frontier parent

## Promotion rule

If a Pi-specific rule only helps Pi/local routes, keep it local.
If it wins repeatedly across Claude, Codex, and Pi routes, promote it to core.

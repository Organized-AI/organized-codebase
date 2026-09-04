# Pi Agent Companion Surface

This directory holds **optional local harness assets** for Organized Codebase.

## Principle

Use sibling harnesses for local-model specialization instead of bloating the global scaffold.

## Assets

- `frontier-pairings.json` — known local/frontier pairing presets

## Typical flow

1. Pick a frontier parent (`claude-sonnet-4`, `claude-opus-4-20250514`, `gpt-5-codex`)
2. Pick a local worker (`qwen3:8b`, `gemma-4-e4b-it-Q4_K_M`)
3. Run `node scripts/scaffold-pi-harness.js ...`
4. Evaluate the sibling harness on a representative task pack
5. Promote only the reusable rules

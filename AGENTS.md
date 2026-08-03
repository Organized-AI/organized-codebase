# AGENTS.md

## Organized Codebase — cross-harness operator brief

This repository stays **Claude-first at the core** and adds **Codex**, **Organized Router**, and **Pi Agent companion** surfaces as opt-in layers.

### Read order
1. `README.md`
2. `CLAUDE.md`
3. `DOCUMENTATION/CODEX-SETUP.md` when using Codex
4. `CONFIG/router/README.md` when routing across local/frontier models
5. `DOCUMENTATION/PI-AGENT-HARNESS-COMPANION.md` when spinning up Pi/local harnesses

## Working rules
- Preserve Boris methodology: plan first, verify before commit, review before merge.
- Keep **Organized Router** separate from the core scaffold. Routing policy belongs in `CONFIG/router/`.
- Keep **Pi/local harness rules** separate from core workflow. Harness-specific behavior belongs in `harnesses/pi-agent/`.
- Prefer small/local models for summarization, classification, repo orientation, and privacy-sensitive first passes.
- Escalate to frontier models for ambiguous planning, high-stakes codegen, difficult debugging, and final judgment.
- Do not claim a local model "matches" a frontier model globally. Pair it to mimic the frontier model's **task shape, verifier posture, and output contract** for narrow workloads.

## Codex surface
- Project-local Codex config lives in `.codex/`.
- Role cards live in `.codex/agents/`.
- Keep Codex instructions thin and aligned to Boris rather than duplicating the whole repo manual.

## Router surface
- Router config is declarative and separate.
- Task class, privacy boundary, verification burden, and cost ceiling decide routing.
- Deterministic verification should beat model escalation whenever possible.

## Pi harness surface
- Pi harnesses should be sibling harnesses, not mutations of the global core.
- Each harness should carry its own pairing manifest, permissions, verifier contract, and task packets.
- Promote only rules that win across multiple harnesses and models.

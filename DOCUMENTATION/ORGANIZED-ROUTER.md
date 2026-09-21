# Organized Router in Organized Codebase

Organized Router is the policy layer that decides **which harness should do the next unit of work**.

## Scope

Router should answer:
- does this task stay local?
- does it need Claude judgment?
- does it benefit from Codex execution context?
- can deterministic tools answer before a model is called?

Router should **not** own:
- Codex role card details
- Pi harness verifier internals
- project-specific business rules unrelated to routing

## Initial task classes

- summarize
- classify
- plan
- codegen
- review
- verify
- research
- artifact-polish

## Practical use

- local routes for compression, triage, and privacy-sensitive first passes
- Claude routes for stronger judgment and synthesis
- Codex routes for code-heavy execution surfaces
- deterministic verification before model escalation whenever possible

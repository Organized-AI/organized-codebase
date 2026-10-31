# Window budget: when one window is enough and when it is not

The constraint this skill exists under: **minimize multiple context windows** without giving up
independent review. This file is the decision rule set, grounded in
[Anthropic's fold-in guidance](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)
(2026-10-22) and the EGM elephant/goldfish split.

## Stay in the builder window when

- The change is small or medium and the conversation is still coherent.
- You are applying reviewer findings. The builder's context is exactly what makes fixes cheap;
  a fresh fixer re-derives everything and introduces new drift.
- The session got long. Compact and continue; the spec, notes, and evidence files carry state,
  so compaction is not a restart.

## Open a fresh window only for

| Reason | What the new window gets | What it must NOT get |
|--------|--------------------------|----------------------|
| **Review independence** | The spec and the diff | The build transcript, your reasoning, a summary of "intent" |
| **Verify independence** | The flow brief (end state, rows, side effects) | The driver's or builder's claims |
| **Measurable degradation** | The spec + notes files, reloaded | Nothing else; if you cannot point at degradation, do not split |
| **Parallel disposable work** | A self-contained brief (research, exploration) | Shared mutable state |

## Never

- **Split by job title.** Persona teams (a "PM agent", an "architect agent", a "senior dev agent")
  are an org chart, not a context decision. Splitting by problem type instead of context need is
  the telephone game: each hand-off loses state and re-interprets the goal.
- **Ticket fan-out.** Slicing one change across parallel fresh windows multiplies coordination
  cost and merge conflicts while proving nothing extra.
- **Review in the builder window.** That is a builder checking its own work.

## What it costs

| Shape | Long-lived windows | Fresh dispatches | Independence |
|-------|--------------------|------------------|--------------|
| Small fix, no loop | 1 | 0 | self-checked (`/verify`) |
| Typical task-loop run | 1 | 2 (reviewer + verifier) | review and verify independent |
| EGM default review round | 1 | 6+ personas + synthesizer | maximal, at swarm cost |

The typical row is the design point: two cheap, stateless dispatches buy the independence that
matters, and everything else shares one context.

## Escalation

When a spec is large, public-facing, or irreversible, say so and opt into the full EGM swarm
deliberately. The swarm is a tool for high-stakes design docs, not the default for a Tuesday fix.

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
| **Verify independence** | Driver: one matrix row's brief (entry point, end state, rows, side effects, reset command). Reader: the round's evidence files | The builder's claims; for the reader, the drivers' claims too |
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

With `R` review rounds (including any delta review), `V` verify rounds, and `N` matrix rows:

```
fresh dispatches = R + V x (N + 1)      one driver per row, one reader per verify round
```

A verify round after a fix re-drives only the affected rows, so its `N` is the number of rows
re-driven, not the whole matrix.

| Shape | Long-lived windows | Fresh dispatches | Independence |
|-------|--------------------|------------------|--------------|
| Small fix, no loop | 1 | 0 | self-checked (`/verify`) |
| Typical run, no runnable surface | 1 | `R` (1 when the first review passes) | review independent; verify is the `/verify` suite |
| Typical run, `N` matrix rows | 1 | `R + V x (N + 1)` (3 rows, clean first time: 1 + 4 = 5) | review and every row independent |
| Large or risky, drift as a dispatch | 1 | the line above, + 1 | adds independent drift |
| EGM default review round | 1 | 6+ personas + synthesizer | maximal, at swarm cost |

The typical rows are the design point: cheap, stateless dispatches buy the independence that
matters, and everything else shares one context. If `N` gets large, cut journeys the change cannot
reach before adding windows; the matrix should test this change, not the whole app.

## Escalation

When a spec is large, public-facing, or irreversible, say so and opt into the full EGM swarm
deliberately. The swarm is a tool for high-stakes design docs, not the default for a Tuesday fix.

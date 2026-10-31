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
| **Verify independence** | Driver: `matrix.md` and the reset command. Reader: the round's evidence files (raw output only) | The builder's claims; for the reader, the driver's summaries too |
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

`R` is the number of review rounds (a delta review included, at most 2). Each verify round `v` (at
most 2) uses `D_v` drivers: 1 when its rows run in order, one per sandbox when they run in parallel.

```
fresh dispatches = R + sum over verify rounds of (D_v + 1)      the +1 is the reader
```

Matrix size does not add windows: one driver resets and drives every row in order, which already
isolates their state. Parallel sandboxes are the only thing that adds drivers.

| Shape | Long-lived windows | Fresh dispatches | Independence |
|-------|--------------------|------------------|--------------|
| Small fix, no loop | 1 | 0 | self-checked (`/verify`) |
| Typical run, no runnable surface | 1 | `R` (1 when the first review passes) | review independent; verify is the `/verify` suite |
| Typical run, rows in order | 1 | `R + 2` per verify round (clean first time: 1 + 2 = 3) | review, driving, and judging independent |
| Typical run, rows in `k` parallel sandboxes | 1 | `R + (k + 1)` per verify round | the same, faster, at `k - 1` extra windows |
| Large or risky, drift as a dispatch | 1 | the line above, + 1 | adds independent drift |
| EGM default review round | 1 | 6+ personas + synthesizer | maximal, at swarm cost |

The typical rows are the design point: cheap, stateless dispatches buy the independence that
matters, and everything else shares one context. Run rows in parallel only when the wait matters
more than the windows.

## Escalation

When a spec is large, public-facing, or irreversible, say so and opt into the full EGM swarm
deliberately. The swarm is a tool for high-stakes design docs, not the default for a Tuesday fix.

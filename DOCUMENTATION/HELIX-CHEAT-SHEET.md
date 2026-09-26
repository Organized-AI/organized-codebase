# Helix Methodology Cheat Sheet

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        HELIX METHODOLOGY CHEAT SHEET                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  CORE PRINCIPLE:  "The reference is the spec. Gates block. Converge."        ║
║  USE WHEN:        porting / rebuilding / cloning something that exists       ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  COMMANDS                                                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    kata enter helix    →  Helix mode (prefix HX)                             ║
║    /helix-gate CP-NN   →  G1 → G2 → G3 loop, restart from G1 after any fix   ║
║    /helix-next N       →  Run next N checkpoints, G4 batched at the end      ║
║    /commit             →  One commit per checkpoint                          ║
║    /ablate             →  Promote proven helix-memory entries                ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PLAN (once)                                                                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    1. PIN      →  reference + pinned_at (SHA / deploy / export date)         ║
║    2. SKELETON →  helix-planner → checkpoints.json (≤6-word titles)          ║
║    3. APPROVE  →  human approves the SEQUENCE only (not the details)         ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PER CHECKPOINT                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    memory → acceptance (from reference) → tests RED → code GREEN             ║
║        → /helix-gate → G4 human → /commit "feat(helix): CP-NN <title>"       ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  THE FOUR GATES  (ordered · blocking · FAIL and INVALID both block)          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    G1 BEHAVIOR  test-agent (HELIX MODE): user-perspective tests,             ║
║                 must pass on reference AND target                            ║
║    G2 VISUAL    workers/helix-visual-gate: Gemini diff, blocker by default   ║
║                 (skip only when has_ui: false, with a reason)                ║
║    G3 REVIEW×2  helix-reviewer-a (architecture/correctness)                  ║
║                 helix-reviewer-b (reference fidelity/hostile user)           ║
║                 context-isolated · both must PASS · system-design.md         ║
║    G4 HUMAN     inline, or batched at the end of /helix-next N               ║
║                                                                              ║
║    Any fix ⇒ back to G1.   3 failed loops ⇒ blocked + memory entry.          ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  FILES                                                                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    PLANNING/helix/checkpoints.json         plan + gate state                 ║
║    PLANNING/helix/checkpoints.schema.json  schema                            ║
║    PLANNING/helix/helix-memory.md          feedback memory                   ║
║    PLANNING/helix/evidence/CP-NN/          g1 · g2 · g3a · g3b · bundle.json ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  CHECKER  (node scripts/helix/helix-check.js …)                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    validate           plan is well-formed and internally consistent          ║
║    next N             which checkpoints can run now                          ║
║    stop CP-NN         kata stop: gates_passed + checkpoint_committed         ║
║    evidence --all     bundle.json per checkpoint (Stop hook uses this)       ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  MEMORY → CLAUDE.md                                                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    G4 reject / repeat G2-G3 finding / blocked  →  helix-memory.md (active)   ║
║    prevented on ≥3 checkpoints  →  candidate  →  /ablate                     ║
║    smallest home wins: test > reviewer checklist > one CLAUDE.md line        ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  NEVER                                                                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ✗ treat INVALID as a pass           ✗ skip G2 on a UI checkpoint          ║
║    ✗ run G3 before G1+G2 pass          ✗ show a reviewer the other's verdict ║
║    ✗ fix a test to fail the reference  ✗ skip past a blocked checkpoint      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## Helix vs Boris

| | Boris | Helix |
|---|---|---|
| When | Always (baseline) | A reference exists and "done" = "matches it" |
| Source of truth | `CLAUDE.md` + tests | The pinned reference |
| Unit | Feature | Checkpoint (≤ 6-word title, one commit) |
| Human approves | Plan | Checkpoint sequence only |
| Verification | `/verify` | 4 ordered blocking gates |
| Learning | `CLAUDE.md` DO NOT | `helix-memory.md` → `/ablate` → `CLAUDE.md` |

Helix runs *on top of* Boris: `/verify`, `/commit`, permissions, and `/ablate` all still apply.

## Multiple targets

One worktree per target (branch + `checkpoints.json` + evidence each). See
`.claude/skills/git-worktree-master/SKILL.md` → "Helix: Worktree per Target".

## Full reference

- Skill: `.claude/skills/helix/SKILL.md`
- Gate command: `.claude/commands/helix-gate.md`
- Autonomous runs + promotion path: `.claude/commands/helix-next.md`
- Visual gate worker: `workers/helix-visual-gate/README.md`
- Evidence hook: `.claude/hooks/stop-verification-evidence.md`

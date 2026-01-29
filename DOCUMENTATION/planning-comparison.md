# Planning & Task Execution Comparison
## Ralphy vs Organized Codebase vs GET SHIT DONE

---

## Executive Summary

| System | Philosophy | Human Involvement | Best For |
|--------|------------|-------------------|----------|
| **Ralphy** | "One command, walk away" | Minimal (PRD creation only) | Fast builds, known patterns |
| **OC/Boris** | "Verify before you trust" | Moderate (phase-by-phase) | Quality-critical, learning |
| **GSD** | "Keep context fresh" | Moderate (milestone gates) | Long projects, complex features |

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PLANNING SYSTEMS COMPARISON                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   RALPHY                OC (Boris)              GSD                         │
│   ══════                ══════════              ═══                         │
│                                                                             │
│   PRD Files ─────►      PHASE-X-PROMPT.md ──►   PROJECT.md ──────►          │
│       │                      │                      │                       │
│       ▼                      ▼                      ▼                       │
│   ┌─────────┐           ┌─────────┐           ┌─────────┐                   │
│   │ Ralphy  │           │ Claude  │           │  GSD    │                   │
│   │ Engine  │           │  Code   │           │Orchestr.│                   │
│   └────┬────┘           └────┬────┘           └────┬────┘                   │
│        │                     │                     │                        │
│   AUTO-EXECUTE          MANUAL-TRIGGER       FRESH-CONTEXT                  │
│        │                     │                     │                        │
│        ▼                     ▼                     ▼                        │
│   ┌─────────┐           ┌─────────┐           ┌─────────┐                   │
│   │Checkbox │           │ /verify │           │Parallel │                   │
│   │  Pass?  │           │ /commit │           │Executors│                   │
│   └────┬────┘           └────┬────┘           └────┬────┘                   │
│        │                     │                     │                        │
│        ▼                     ▼                     ▼                        │
│   Auto-Commit           Ask-Commit            Task-Commit                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. RALPHY: Autonomous PRD Execution

### Philosophy
> "Generate PRDs, run one command, walk away."

Ralphy is a **fire-and-forget** system. You define what needs to be built in PRD files with checkboxes, and Ralphy handles the entire execution pipeline.

### Planning Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     RALPHY PLANNING FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   HUMAN INPUT                       RALPHY OUTPUT               │
│   ───────────                       ────────────                │
│                                                                 │
│   ┌───────────────┐                                             │
│   │ Define Vision │                                             │
│   │ & Requirements│                                             │
│   └───────┬───────┘                                             │
│           │                                                     │
│           ▼                                                     │
│   ┌───────────────┐      ┌──────────────────────────┐          │
│   │ Create PRDs   │ ───► │  prd/                    │          │
│   │ with Checkbox │      │  ├── phase-0-setup.md    │          │
│   │ Tasks         │      │  ├── phase-1-infra.md    │          │
│   └───────┬───────┘      │  └── phase-2-core.md     │          │
│           │              └──────────────────────────┘          │
│           ▼                                                     │
│   ┌───────────────┐      ┌──────────────────────────┐          │
│   │ Configure     │ ───► │  .ralphy/config.yaml     │          │
│   │ Rules/Bounds  │      │  - test/lint/build cmds  │          │
│   └───────────────┘      │  - rules & boundaries    │          │
│                          └──────────────────────────┘          │
│                                                                 │
│   ════════════════════════════════════════════════════════════ │
│                    HUMAN WORK ENDS HERE                        │
│   ════════════════════════════════════════════════════════════ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Task Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   RALPHY EXECUTION ENGINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   $ ralphy --prd prd/ -- --dangerously-skip-permissions         │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  PHASE 0                                                │   │
│   │  ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐         │   │
│   │  │ Read  │──►│Execute│──►│Verify │──►│Commit │         │   │
│   │  │ PRD   │   │ Tasks │   │  ✓?   │   │Changes│         │   │
│   │  └───────┘   └───────┘   └───┬───┘   └───────┘         │   │
│   │                              │                          │   │
│   │                        YES ──┴── NO                     │   │
│   │                         │        │                      │   │
│   │                         ▼        ▼                      │   │
│   │                    Continue   Retry                     │   │
│   └─────────────────────────┼───────────────────────────────┘   │
│                             │                                   │
│   ┌─────────────────────────┼───────────────────────────────┐   │
│   │  PHASE 1               ▼                                │   │
│   │  [Same pattern: Read → Execute → Verify → Commit]       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                             │                                   │
│   ┌─────────────────────────┼───────────────────────────────┐   │
│   │  PHASE N...            ▼                                │   │
│   │  [Continues until all phases complete]                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   MONITORING: tail -f .ralphy/progress.txt                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. OC (Organized Codebase) + Boris Methodology

### Philosophy
> "Always give Claude a way to verify its work."

OC/Boris emphasizes **verification-first development**. Every action should have a clear way to verify it worked correctly.

### Planning Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   OC/BORIS PLANNING FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                 DOCUMENTATION PHASE                     │   │
│   │                                                         │   │
│   │   PLANNING/                    ARCHITECTURE/            │   │
│   │   ├── PROJECT.md               └── system-design.md     │   │
│   │   ├── REQUIREMENTS.md                                   │   │
│   │   ├── ROADMAP.md               AGENT-HANDOFF/           │   │
│   │   └── implementation-phases/   └── HANDOFF.md           │   │
│   │       ├── PHASE-0-PROMPT.md                             │   │
│   │       ├── PHASE-1-PROMPT.md                             │   │
│   │       └── PHASE-N-PROMPT.md                             │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                PHASE PROMPT STRUCTURE                   │   │
│   │                                                         │   │
│   │   PHASE-X-PROMPT.md                                     │   │
│   │   ═══════════════════                                   │   │
│   │                                                         │   │
│   │   ## Objective                                          │   │
│   │   [What this phase accomplishes]                        │   │
│   │                                                         │   │
│   │   ## Prerequisites                                      │   │
│   │   [What must be complete first]                         │   │
│   │                                                         │   │
│   │   ## Context Files                                      │   │
│   │   [Files to read before starting]                       │   │
│   │                                                         │   │
│   │   ## Tasks                                              │   │
│   │   [Complete implementation specs]                       │   │
│   │                                                         │   │
│   │   ## Success Criteria  ◄── KEY DIFFERENCE               │   │
│   │   [ ] Criterion 1                                       │   │
│   │   [ ] Criterion 2                                       │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Task Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   OC/BORIS EXECUTION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   SESSION START                                                 │
│   ═════════════                                                 │
│                                                                 │
│   ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐                │
│   │/status│──►│ Read  │──►│ Check │──►│ Plan  │                │
│   │       │   │CLAUDE │   │ TODOs │   │ Work  │                │
│   └───────┘   │ .md   │   └───────┘   └───┬───┘                │
│               └───────┘                   │                     │
│                                           ▼                     │
│   FEATURE WORK                                                  │
│   ════════════                                                  │
│                                                                 │
│   "I will implement X by doing Y, and verify by Z"              │
│                                                                 │
│   ┌───────┐        ┌─────────┐        ┌───────┐                │
│   │ PLAN  │───────►│IMPLEMENT│───────►│VERIFY │                │
│   │(always│        │(one feat│        │(before│                │
│   │ first)│        │ at time)│        │commit)│                │
│   └───────┘        └─────────┘        └───┬───┘                │
│                                           │                     │
│                                    ┌──────┴──────┐              │
│                                    │             │              │
│                                    ▼             ▼              │
│                               ┌───────┐     ┌───────┐          │
│                               │/verify│     │ FAIL  │          │
│                               │ PASS  │     │ STOP  │          │
│                               └───┬───┘     │ FIX   │          │
│                                   │         └───┬───┘          │
│                                   ▼             │               │
│                               ┌───────┐        │               │
│                               │/commit│◄───────┘               │
│                               │(asks!)│                        │
│                               └───────┘                        │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   PRE-COMMIT VERIFICATION (/verify)                             │
│   ═════════════════════════════════                             │
│                                                                 │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│   │  git   │ │npm run │ │npm run │ │  npm   │ │npm run │       │
│   │ status │ │  lint  │ │  tsc   │ │  test  │ │ build  │       │
│   └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘       │
│       ▼          ▼          ▼          ▼          ▼            │
│      [✓]        [✓]        [✓]        [✓]        [✓]           │
│                                                                 │
│   ALL PASS ──► /commit                                          │
│   ANY FAIL ──► STOP, fix first                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Boris Command Ecosystem

```
┌─────────────────────────────────────────────────────────────────┐
│                  BORIS COMMAND ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   DAILY WORKFLOW                                                │
│   ══════════════                                                │
│                                                                 │
│   Session Start ──► /status ──► Read CLAUDE.md ──► Plan         │
│                                                                 │
│   Feature Work ───► Plan ──► Implement ──► /verify ──► /commit  │
│                                                                 │
│   Before PR ──────► /review ──► verify-architecture ──► PR      │
│                                                                 │
│   On Error ───────► Document in CLAUDE.md "DO NOT" ──► Commit   │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   COMMANDS                        AGENTS                        │
│   ════════                        ══════                        │
│                                                                 │
│   /status  → Health check         verify-architecture → Files,  │
│   /verify  → Run all checks                         imports,    │
│   /commit  → Smart commit                           conventions │
│   /review  → Self-review                                        │
│                                   verify-build → Clean install, │
│                                                  build, test    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. GSD (GET SHIT DONE)

### Philosophy
> "Keep context fresh to prevent quality degradation."

GSD solves "context rot" - quality decline as context fills. Uses **fresh 200k contexts** for heavy lifting.

### Planning Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     GSD PLANNING FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   /gsd:new-project                                              │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                VISION EXTRACTION                        │   │
│   │                                                         │   │
│   │   "What are we building?" ────┐                         │   │
│   │   "Who is the primary user?" ─┼──► Keep asking until    │   │
│   │   "Why does this exist?" ─────┤    vision is CLEAR      │   │
│   │   "What is success?" ─────────┘                         │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                PARALLEL RESEARCH                        │   │
│   │                                                         │   │
│   │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │   │
│   │   │  STACK  │  │FEATURES │  │  ARCH   │  │PITFALLS │   │   │
│   │   │ RESEARCH│  │RESEARCH │  │RESEARCH │  │RESEARCH │   │   │
│   │   │  AGENT  │  │  AGENT  │  │  AGENT  │  │  AGENT  │   │   │
│   │   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │   │
│   │        └────────────┴────────────┴────────────┘        │   │
│   │                         │                               │   │
│   │                         ▼                               │   │
│   │                  ┌─────────────┐                        │   │
│   │                  │  research/  │                        │   │
│   │                  │  directory  │                        │   │
│   │                  └─────────────┘                        │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                GENERATED ARTIFACTS                      │   │
│   │                                                         │   │
│   │   .planning/config.json ── mode: yolo|interactive       │   │
│   │                                                         │   │
│   │   PROJECT.md ──────────── Vision (always loaded)        │   │
│   │   REQUIREMENTS.md ──────── v1/v2/out-of-scope           │   │
│   │   ROADMAP.md ───────────── Milestone breakdown          │   │
│   │   STATE.md ─────────────── Decisions & blockers         │   │
│   │   research/ ────────────── Domain knowledge             │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Task Execution Flow (5 Phases)

```
┌─────────────────────────────────────────────────────────────────┐
│                  GSD FIVE-PHASE EXECUTION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   PHASE 1: INITIALIZE (/gsd:new-project)                        │
│   ══════════════════════════════════════                        │
│   Structured questioning ──► Parallel research ──► Create docs  │
│                                    │                            │
│                                    ▼                            │
│   PHASE 2: DISCUSS (/gsd:discuss-phase N)                       │
│   ═══════════════════════════════════════                       │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │ Identify │───►│ Capture  │───►│ Create   │                 │
│   │ gray     │    │ decisions│    │CONTEXT.md│                 │
│   │ areas    │    │ before   │    │ for next │                 │
│   └──────────┘    │ planning │    │ agents   │                 │
│                   └──────────┘    └──────────┘                 │
│                                    │                            │
│                                    ▼                            │
│   PHASE 3: PLAN (/gsd:plan-phase N)                             │
│   ═════════════════════════════════                             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              PLANNER + CHECKER LOOP                     │   │
│   │                                                         │   │
│   │   ┌───────┐      ┌───────┐      ┌───────┐              │   │
│   │   │PLANNER│─────►│CHECKER│─────►│ PASS? │              │   │
│   │   │ Agent │      │ Agent │      │       │              │   │
│   │   └───────┘      └───────┘      └───┬───┘              │   │
│   │       ▲                             │                   │   │
│   │       │                      NO ────┴──── YES           │   │
│   │       │                       │            │            │   │
│   │       └───────────────────────┘            ▼            │   │
│   │                                      XML Task Plans     │   │
│   │                                      (2-3 atomic)       │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                    │                            │
│                                    ▼                            │
│   PHASE 4: EXECUTE (/gsd:execute-phase N)                       │
│   ═══════════════════════════════════════                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │         PARALLEL EXECUTION - FRESH CONTEXTS             │   │
│   │                                                         │   │
│   │   ORCHESTRATOR (lean, <10k tokens)                      │   │
│   │        │                                                │   │
│   │        ├──────────┬──────────┬──────────┐               │   │
│   │        ▼          ▼          ▼          ▼               │   │
│   │   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │   │
│   │   │EXECUTOR│ │EXECUTOR│ │EXECUTOR│ │EXECUTOR│          │   │
│   │   │   #1   │ │   #2   │ │   #3   │ │   #4   │          │   │
│   │   │(FRESH  │ │(FRESH  │ │(FRESH  │ │(FRESH  │          │   │
│   │   │ 200k!) │ │ 200k!) │ │ 200k!) │ │ 200k!) │          │   │
│   │   └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘          │   │
│   │       ▼          ▼          ▼          ▼               │   │
│   │   [COMMIT]   [COMMIT]   [COMMIT]   [COMMIT]            │   │
│   │   abc123     def456     ghi789     jkl012              │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                    │                            │
│                                    ▼                            │
│   PHASE 5: VERIFY (/gsd:verify-work N)                          │
│   ════════════════════════════════════                          │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐              │
│   │ Manual UAT│───►│ Pass/Fail │───►│ Debug     │              │
│   │ by Human  │    │    ?      │    │ Agent +   │              │
│   └───────────┘    └─────┬─────┘    │ Fix Plans │              │
│                          │          └───────────┘              │
│                   PASS ──┴── FAIL                               │
│                    │          │                                 │
│                    ▼          ▼                                 │
│               Next Phase   Auto-diagnose                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### GSD Command Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    GSD COMMAND ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   CORE WORKFLOW                   MILESTONE MANAGEMENT          │
│   ═════════════                   ════════════════════          │
│                                                                 │
│   /gsd:new-project ► Vision       /gsd:new-milestone ► Start v2 │
│   /gsd:discuss-phase ► Decisions  /gsd:complete-milestone ► Tag │
│   /gsd:plan-phase ► XML tasks     /gsd:audit-milestone ► Verify │
│   /gsd:execute-phase ► Parallel                                 │
│   /gsd:verify-work ► UAT          SESSION MANAGEMENT            │
│                                   ══════════════════            │
│   NAVIGATION                                                    │
│   ══════════                      /gsd:pause-work ► Handoff doc │
│                                   /gsd:resume-work ► Restore    │
│   /gsd:progress ► Status                                        │
│   /gsd:help ► Commands            UTILITIES                     │
│   /gsd:update ► Changelog         ═════════                     │
│                                                                 │
│                                   /gsd:quick ► Skip research    │
│                                   /gsd:map-codebase ► Analyze   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Comparison Matrix

### Execution Models

```
┌─────────────────────────────────────────────────────────────────┐
│                   EXECUTION MODEL COMPARISON                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   RALPHY                                                        │
│   ══════                                                        │
│                                                                 │
│   ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐             │
│   │Phase 0│───►│Phase 1│───►│Phase 2│───►│Phase N│             │
│   │ AUTO  │    │ AUTO  │    │ AUTO  │    │ AUTO  │             │
│   └───────┘    └───────┘    └───────┘    └───────┘             │
│                                                                 │
│   Single sequential agent • Auto-verify • Auto-commit           │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   OC/BORIS                                                      │
│   ════════                                                      │
│                                                                 │
│   ┌───────┐ HUMAN ┌───────┐ HUMAN ┌───────┐ HUMAN              │
│   │Phase 0│──────►│Phase 1│──────►│Phase 2│──────►...          │
│   │VERIFY │  OK?  │VERIFY │  OK?  │VERIFY │  OK?               │
│   └───────┘       └───────┘       └───────┘                    │
│                                                                 │
│   Single agent • Manual triggers • Verification gates           │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   GSD                                                           │
│   ═══                                                           │
│                                                                 │
│                 ┌─────────────────────────┐                     │
│                 │      ORCHESTRATOR       │                     │
│                 │    (lean, <10k tokens)  │                     │
│                 └───────────┬─────────────┘                     │
│                             │                                   │
│        ┌──────────┬─────────┼─────────┬──────────┐             │
│        ▼          ▼         ▼         ▼          ▼             │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│   │RESEARCH│ │RESEARCH│ │PLANNER │ │EXECUTOR│ │EXECUTOR│       │
│   │  (200k)│ │  (200k)│ │ (200k) │ │ (200k) │ │ (200k) │       │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                                 │
│   Multi-agent • Fresh contexts • Parallel • Per-task commit     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Verification Strategies

```
┌─────────────────────────────────────────────────────────────────┐
│                VERIFICATION STRATEGY COMPARISON                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   RALPHY                                                        │
│   ══════                                                        │
│   PRD Checkboxes ──► All ✓? ──► YES ──► Next phase              │
│                          │                                      │
│                         NO ──► Retry task                       │
│                                                                 │
│   Verification = "Are markdown checkboxes complete?"            │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   OC/BORIS                                                      │
│   ════════                                                      │
│   /verify ──► git ──► lint ──► tsc ──► test ──► build          │
│                │       │        │       │        │              │
│                ▼       ▼        ▼       ▼        ▼              │
│               [✓]     [✓]      [✓]     [✓]      [✓]            │
│                                                                 │
│   Verification = "Do all automated checks pass?"                │
│   + verify-architecture + verify-build agents                   │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   GSD                                                           │
│   ═══                                                           │
│   /gsd:verify-work ──► Human UAT ──► Debug Agent ──► Fix Plans  │
│                            │                                    │
│                     PASS ──┴── FAIL                             │
│                      │          │                               │
│                      ▼          ▼                               │
│                 Next Phase   Auto-diagnose                      │
│                                                                 │
│   Verification = "Does human confirm it works?"                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Commit Patterns

```
┌─────────────────────────────────────────────────────────────────┐
│                   COMMIT PATTERN COMPARISON                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   RALPHY                                                        │
│   ══════                                                        │
│   Phase 0 ─────────────────────────► [AUTO COMMIT]              │
│   Phase 1 ─────────────────────────► [AUTO COMMIT]              │
│   Phase 2 ─────────────────────────► [AUTO COMMIT]              │
│                                                                 │
│   Granularity: 1 per phase (coarse)                             │
│   Message: "Phase X complete"                                   │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   OC/BORIS                                                      │
│   ════════                                                      │
│   Feature ──► /verify ──► /commit ──► [ASK] ──► [COMMIT]        │
│                                         │                       │
│                                    "Proceed?"                   │
│                                                                 │
│   Granularity: 1 per feature (medium)                           │
│   Message: "feat(scope): description"                           │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   GSD                                                           │
│   ═══                                                           │
│   Task 1 ──► [COMMIT abc123]                                    │
│   Task 2 ──► [COMMIT def456]                                    │
│   Task 3 ──► [COMMIT ghi789]                                    │
│                                                                 │
│   Granularity: 1 per task (fine)                                │
│   Message: "type(phase-task): description"                      │
│   Benefit: git bisect, independent revert                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Decision Framework

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHEN TO USE EACH                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   USE RALPHY WHEN:                                              │
│   ════════════════                                              │
│   ✓ Clear, complete requirements upfront                        │
│   ✓ Pattern is well-known (CRUD, API, etc.)                     │
│   ✓ Want to walk away and come back to finished code            │
│   ✓ Speed > Control                                             │
│                                                                 │
│   USE OC/BORIS WHEN:                                            │
│   ══════════════════                                            │
│   ✓ Quality and correctness are paramount                       │
│   ✓ Want to learn from the process                              │
│   ✓ Requirements may evolve during development                  │
│   ✓ Control > Speed                                             │
│   ✓ Team projects with shared conventions                       │
│                                                                 │
│   USE GSD WHEN:                                                 │
│   ═════════════                                                 │
│   ✓ Large/complex project (context rot risk)                    │
│   ✓ Need parallel execution for speed                           │
│   ✓ Fine-grained git history matters                            │
│   ✓ Structured discussion before coding                         │
│   ✓ Multiple milestones/versions                                │
│                                                                 │
│   ─────────────────────────────────────────────────────────     │
│                                                                 │
│   COMBINE THEM:                                                 │
│   ═════════════                                                 │
│   • OC structure + GSD commands = Best of both                  │
│   • Ralphy for scaffolding → Boris for refinement               │
│   • GSD for greenfield → Boris for maintenance                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                      QUICK REFERENCE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   RALPHY                                                        │
│   ──────                                                        │
│   Start:   ralphy --prd prd/ -- --dangerously-skip-permissions  │
│   Monitor: tail -f .ralphy/progress.txt                         │
│   Config:  .ralphy/config.yaml                                  │
│   Docs:    prd/phase-X-name.md                                  │
│                                                                 │
│   OC/BORIS                                                      │
│   ────────                                                      │
│   Start:   /status → Read CLAUDE.md → Plan                      │
│   Work:    Plan → Implement → /verify → /commit                 │
│   PR:      /review → verify-architecture → Create PR            │
│   Config:  .claude/settings.json                                │
│   Docs:    PLANNING/implementation-phases/PHASE-X-PROMPT.md     │
│                                                                 │
│   GSD                                                           │
│   ───                                                           │
│   Start:   /gsd:new-project                                     │
│   Phase:   /gsd:discuss-phase N → plan-phase N → execute-phase N│
│   Verify:  /gsd:verify-work N                                   │
│   Status:  /gsd:progress                                        │
│   Config:  .planning/config.json                                │
│   Docs:    PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary Table

| Aspect | Ralphy | OC/Boris | GSD |
|--------|--------|----------|-----|
| **Trigger** | Single command | Manual per phase | Phase-specific commands |
| **Context** | Sequential, shared | Preserved in session | Fresh 200k per executor |
| **Verification** | Checkbox completion | Multi-tool suite | Human UAT + debug agent |
| **Commits** | Auto per phase | Ask before commit | Auto per task |
| **Human touch** | PRD creation only | Every commit | Milestone gates |
| **Config** | `.ralphy/config.yaml` | `.claude/settings.json` | `.planning/config.json` |
| **Best for** | Fast, known patterns | Quality-critical | Large, complex projects |

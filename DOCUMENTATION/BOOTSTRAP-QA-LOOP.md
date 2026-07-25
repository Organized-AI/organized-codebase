# Staged Bootstrap Architecture + QA Loop

## Mermaid Diagram

```mermaid
flowchart TD
    Start([Project Init]) --> P0[Phase 0: Bootstrap Scaffold]
    P0 --> P0a[Pull CLAUDE.md]
    P0 --> P0b[.claude/ skills, commands, agents, hooks]
    P0 --> P0c[PLANNING, ARCHITECTURE, DOCUMENTATION dirs]
    P0a & P0b & P0c --> Gate0{Phase 0 Complete}

    Gate0 --> QA0[[bootstrap-qa.sh phase 0]]
    QA0 -->|FAIL| P0
    QA0 -->|PASS| TokenLayer[Token Efficiency Routing Layer\nscaffolded as module, not yet live]
    QA0 -->|PASS| P1[Phase 1: Active Development]

    P1 --> SandboxGate{Sandbox Prefix Detected}
    SandboxGate -->|sandbox-*| SandboxLayer[Sandboxing Layer\nprocess isolation, permission scoping]
    SandboxGate -->|no prefix| P1cont[Continue Dev]

    P1cont --> Milestone{First Working Build}
    SandboxLayer --> Milestone
    TokenLayer --> QA1[[bootstrap-qa.sh phase 1]]
    SandboxLayer --> QA1
    QA1 -->|FAIL| P1
    QA1 -->|PASS| Milestone

    Milestone -->|triggers| DocGen[Auto-generate Docs]
    Milestone -->|triggers| VisualGen[Auto-generate Visual Surface\nphase-plan-visualizer]

    DocGen --> QA2[[bootstrap-qa.sh phase 2]]
    VisualGen --> QA2
    QA2 -->|FAIL| Milestone
    QA2 -->|PASS| P2[Phase 2: Pre-Launch]

    P2 --> Done([Bootstrap Lifecycle Complete])

    style P0 fill:#2d2d2d,color:#fff
    style Gate0 fill:#444,color:#fff
    style TokenLayer fill:#1a3a3a,color:#fff
    style SandboxLayer fill:#3a1a1a,color:#fff
    style DocGen fill:#1a2a3a,color:#fff
    style VisualGen fill:#1a2a3a,color:#fff
    style QA0 fill:#4a1a4a,color:#fff
    style QA1 fill:#4a1a4a,color:#fff
    style QA2 fill:#4a1a4a,color:#fff
```

Edit/preview link: https://l.mermaid.ai/0PI51Q

---

## ASCII Diagram

```
STAGED BOOTSTRAP ARCHITECTURE (ASCII)

[ Project Init ]
        |
        v
+-----------------------------+
| PHASE 0: Bootstrap Scaffold |
|-----------------------------|
| - Pull CLAUDE.md            |
| - .claude/ (skills, cmds,   |
|   agents, hooks)            |
| - PLANNING / ARCHITECTURE / |
|   DOCUMENTATION dirs        |
+-----------------------------+
        |
        v
   < Phase 0 Complete >
              |
              v
   +-----------------------+
   | QA LOOP                |<---------------------+
   | bootstrap-qa.sh phase0 |                       |
   +-----------------------+                        |
        |            \                              |
     PASS           FAIL ------------ back to -------+ (Phase 0 Scaffold)
        |
        v
       /          \
      /            \
     v              v
+-----------+   +---------------------------+
| TOKEN     |   | PHASE 1:                  |
| ROUTING   |   | Active Development        |
| LAYER     |   +---------------------------+
| (scaffold |              |
|  only,    |              v
|  not live)|      < Sandbox Prefix? >
+-----------+        /            \
                  yes/              \no
                    v                v
          +------------------+   +----------------+
          | SANDBOXING LAYER |   | Continue Dev   |
          | (process         |   +----------------+
          |  isolation,      |         |
          |  permission      |         |
          |  scoping)        |         |
          +------------------+         |
                    \                 /
                     \               /
                      v             v
              +-----------------------+
              | QA LOOP                |<-------+
              | bootstrap-qa.sh phase1 |         |
              +-----------------------+          |
                  |            \                 |
               PASS           FAIL -- back to ---+ (Phase 1 Active Dev)
                  |
                  v
           < First Working Build? >
                          |
                          v
              +-----------------------+
              | AUTO-GENERATE:        |
              | - Docs                |
              | - Visual Surface      |
              |   (phase-plan-vis)    |
              +-----------------------+
                          |
                          v
              +-----------------------+
              | QA LOOP                |<-------+
              | bootstrap-qa.sh phase2 |         |
              +-----------------------+          |
                  |            \                 |
               PASS           FAIL -- back to ---+ (First Working Build)
                  |
                  v
              +-----------------------+
              | PHASE 2: Pre-Launch   |
              +-----------------------+
                          |
                          v
              [ Bootstrap Lifecycle   ]
              [       Complete        ]
```

---

## Usage

```bash
./scripts/qa/bootstrap-qa.sh <project_root> [phase]
# phase = 0 | 1 | 2 | all   (default: all)
```

Run this after any phase reports itself complete, before advancing to the
next phase. A FAIL routes back to the phase you were just in instead of
letting the bootstrap advance on an unverified self-report. Every run
writes a timestamped log to `scripts/qa/`.

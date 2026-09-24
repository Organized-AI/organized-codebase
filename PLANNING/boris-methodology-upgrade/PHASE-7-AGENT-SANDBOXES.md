# Phase 7: Agent Sandboxes (Factory In A Box)

**Objective:** Give the orchestrator a way to run each subagent/task inside a throwaway, credential-isolated VM instead of the shared local machine — extending Phase 6's parallel-session work with real isolation.

**Source:** exe.dev / IndyDevDan, ["Engineers... Your Software Factory NEEDS Agent Sandboxes to SCALE"](https://youtu.be/SEI_qIW4o2c). Indexed and queried via TwelveLabs Jockey (`Agentic Engineering Builds` knowledge store).

---

## The Framework, As Described in the Source

**An agent sandbox is a throwaway VM**, not a git worktree or container — the video explicitly shows a *"throwaway exe.dev VM"* with SSH access and a provisioning-key connection from host into sandbox.

**Structure — "Factory In A Box":** `host → sandbox → factory → app`. The host connects into a disposable sandbox; the sandbox contains a factory (deterministic Python + bounded agents); the factory builds the app ("inkwell"). Inside each sandbox sits its own orchestrator plus a full agent pipeline — request → plan → build → test → review → document — so each agent effectively "owns its own computer" instead of sharing the local machine.

**Security contract — explicit and load-bearing:** *"keys never enter"* the sandbox. The host retains all sensitive credentials; the sandbox is disposable by design, so nothing valuable is lost if it's compromised or simply torn down.

**Lifecycle:**
1. Outer orchestrator provisions a VM sandbox
2. Mount/create the sandbox environment
3. Host connects in via SSH / provisioning key (no credentials cross the boundary)
4. In-sandbox orchestrator runs
5. Worker agents carry out the SDLC chain (request → plan → build → test → review → document)
6. Sandbox is torn down — throwaway by design

---

## Fit Against This Repo

| Location | What's there now | Gap |
|---|---|---|
| `SUBAGENT-FRAMEWORK/` | Orchestrator-centered architecture, file-based memory, parallel/sequential subagent execution | No VM isolation layer, no "keys never enter" credential boundary — subagents share one filesystem and inherit host credentials |
| `PLANNING/boris-methodology-upgrade/PHASE-6-PARALLEL-CLOUD-SESSIONS.md` | "Parallel sessions" via numbered terminal tabs, using git as the sync point | Coordination-by-convention on a shared machine — the opposite of "each agent owns its own computer" |
| `openclaw-agents:clawbox-deploy` skill | Already VM-based: deploys OpenClaw instances inside Clawbox macOS VMs on headless Mac Minis, with Tailscale mesh and SSH-style remote management (`clawbox-manage`) | Currently scoped to long-lived per-client agents, not throwaway per-task software-factory sandboxes. No "keys never enter" contract documented, no teardown-by-design lifecycle. |
| `.claude/hooks/` | `session-start-ablation-check.md`, `stop-verification-evidence.md` | No sandbox-lifecycle hook (provision on start, teardown on stop) |

**Verdict:** the closest infrastructure precedent already exists in-house — **Clawbox** (VM-based, SSH-managed, Tailscale-meshed agent deployment). This framework isn't a net-new primitive; it's Clawbox's philosophy retargeted from "one persistent VM per client" to "one throwaway VM per task," plus the explicit "keys never enter" credential boundary Clawbox doesn't currently formalize.

Git worktrees stay useful as a lighter-weight tier for same-machine parallel sessions (what Phase 6 already covers), but they are **not** what this framework uses for isolation — VM sandboxes are the isolated/untrusted-work tier, worktrees are the lightweight tier.

---

## Proposed Structure

```
organized-codebase/
├── SUBAGENT-FRAMEWORK/
│   └── sandboxes/                        # NEW
│       ├── README.md                     # host→sandbox→factory→app contract, "keys never enter" rule
│       ├── provision-sandbox.sh          # spins up a throwaway VM (Clawbox-style)
│       ├── connect-sandbox.sh            # SSH/provisioning-key connection, no credentials copied in
│       └── teardown-sandbox.sh           # tears the VM down when the SDLC chain completes
├── .claude/
│   ├── hooks/
│   │   ├── sandbox-session-start.md      # NEW: provision + connect before work begins
│   │   └── sandbox-session-stop.md       # NEW: teardown, confirm no keys were copied in
│   └── skills/
│       └── agent-sandbox-provisioner/    # NEW skill, distributable like organized-codebase-applicator
└── PLANNING/boris-methodology-upgrade/
    └── PHASE-7-AGENT-SANDBOXES.md         # this file
```

### Why lean on Clawbox instead of building fresh VM tooling

- Clawbox VMs already run on headless Mac Minis with Tailscale + SSH — the exact primitives the source video shows (throwaway VM, provisioning-key connection)
- `clawbox-manage` already covers lifecycle operations (status, restart, logs, recreate) — teardown-by-design is a config change, not new tooling
- The one real gap to close: formalizing "keys never enter" as an explicit, enforced rule (host holds credentials, sandbox never receives them) — Clawbox doesn't document this boundary today

---

## Tasks

### Task 1: Define the Sandbox Contract
Write `SUBAGENT-FRAMEWORK/sandboxes/README.md` documenting:
- The `host → sandbox → factory → app` structure
- The "keys never enter" rule — explicit and enforced, not just documented
- What state a sandbox owns vs. what stays on the host

### Task 2: Retarget Clawbox Provisioning
Reuse `clawbox-deploy`'s VM/Tailscale/SSH pattern, retargeted for throwaway, per-task sandboxes instead of persistent per-client agents. Teardown-by-design instead of persistent-by-default.

### Task 3: Build Provision/Connect/Teardown Scripts
```
SUBAGENT-FRAMEWORK/sandboxes/provision-sandbox.sh
SUBAGENT-FRAMEWORK/sandboxes/connect-sandbox.sh
SUBAGENT-FRAMEWORK/sandboxes/teardown-sandbox.sh
```

### Task 4: Wire In Session-Lifecycle Hooks
```
.claude/hooks/sandbox-session-start.md   # provision + connect before work begins
.claude/hooks/sandbox-session-stop.md    # teardown + verify no credentials were copied in
```

### Task 5: Package as a Distributable Skill
`.claude/skills/agent-sandbox-provisioner/` — same shape as `organized-codebase-applicator`.

### Task 6: Update the SUBAGENT-FRAMEWORK Orchestrator
Outer orchestrator provisions one sandbox per subagent/task. In-sandbox orchestrator runs the request → plan → build → test → review → document chain, matching the source framework's pipeline.

---

## Verification Checklist

- [ ] Sandbox contract documented and the "keys never enter" rule is enforced (not just written down)
- [ ] Clawbox provisioning retargeted for throwaway per-task use
- [ ] Provision/connect/teardown scripts tested on a throwaway task
- [ ] Confirmed no host credentials are ever present inside a sandbox
- [ ] Session-lifecycle hooks fire correctly on start/stop
- [ ] Skill installs cleanly via the existing skill-creator-enhanced pattern
- [ ] Orchestrator provisions one sandbox per subagent/task

---

## Prompt Template

```
claude --dangerously-skip-permissions

Read PLANNING/boris-methodology-upgrade/PHASE-6-PARALLEL-CLOUD-SESSIONS.md,
SUBAGENT-FRAMEWORK/README.md, and the openclaw-agents:clawbox-deploy and
clawbox-manage skill docs for existing conventions this must build on.

Build the agent-sandboxes capability described in
PLANNING/boris-methodology-upgrade/PHASE-7-AGENT-SANDBOXES.md.
Use the Organized Codebase agent templates in .claude/{skills,commands,agents}
as a first step.

Core contract (from the exe.dev "Factory In A Box" framework):
- Structure: host → sandbox → factory → app
- Sandbox = a throwaway VM (reuse the Clawbox provisioning pattern, retargeted
  from persistent-per-client to disposable-per-task)
- Security rule, non-negotiable: "keys never enter" — the host retains all
  credentials; the sandbox never receives them
- Inside each sandbox: its own orchestrator running the SDLC chain
  (request → plan → build → test → review → document)

Work through Tasks 1-6 in order. Verify each against the checklist before
moving to the next.
```

---

## Completion

When complete:
1. Test sandbox provision → connect → run → teardown on a throwaway task
2. Confirm no host credentials are ever present inside a sandbox
3. Git commit: "Phase 7: Agent sandboxes (Factory In A Box)"

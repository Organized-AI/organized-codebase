# Component Synergy Matrix

This reference shows how different component types complement each other. Use this when recommending tech stacks to maximize effectiveness.

---

## Cross-Type Synergies

### 🤖 Agent + ⚡ Command Synergies

| Agent | Command | Synergy Effect |
|-------|---------|----------------|
| Frontend Developer | Create Feature | Agent provides context for feature scaffolding |
| Code Reviewer | Code Review | Agent enhances command's analysis depth |
| Backend Architect | Create Architecture Documentation | Agent structures documentation comprehensively |
| Test Engineer | Generate Tests | Agent ensures test strategy alignment |
| Debugger | Ultra Think | Agent provides debugging context for deep analysis |

### 🤖 Agent + 🪝 Hook Synergies

| Agent | Hook | Synergy Effect |
|-------|------|----------------|
| Code Reviewer | Lint On Save | Agent reviews while hook enforces style |
| Frontend Developer | Smart Formatting | Agent writes, hook formats automatically |
| Test Engineer | Run Tests After Changes | Agent validates test coverage on each edit |
| Security Specialist | Security Scanner | Agent provides threat context for scans |

### 🤖 Agent + 🔌 MCP Synergies

| Agent | MCP | Synergy Effect |
|-------|-----|----------------|
| Frontend Developer | Context7 | Agent gets latest framework documentation |
| Database Architect | PostgreSQL Integration | Agent can inspect and modify schemas |
| DevOps Engineer | GitHub Integration | Agent manages repos and deployments |
| Search Specialist | Web Fetch | Agent synthesizes external research |

### ⚡ Command + 🪝 Hook Synergies

| Command | Hook | Synergy Effect |
|---------|------|----------------|
| Commit | Smart Commit | Command triggered, hook generates message |
| Generate Tests | Run Tests After Changes | Tests auto-run when generated |
| Refactor Code | Lint On Save | Code auto-linted after refactoring |

### ⚡ Command + ⚙️ Setting Synergies

| Command | Setting | Synergy Effect |
|---------|---------|----------------|
| Commit | Git Commit Settings | Command follows commit conventions |
| Generate Tests | Development Mode | Command has full test execution permissions |
| Containerize | Allow NPM Commands | Command can run Docker builds |

### 🪝 Hook + ⚙️ Setting Synergies

| Hook | Setting | Synergy Effect |
|------|---------|----------------|
| Lint On Save | Development Mode | Hook has lint execution permissions |
| Auto Git Add | Allow Git Operations | Hook can stage files |
| Security Scanner | Bash Timeouts | Scanner won't hang on large codebases |

### 🔌 MCP + 🎨 Skill Synergies

| MCP | Skill | Synergy Effect |
|-----|-------|----------------|
| Memory Integration | Any Skill | Skill knowledge persists across sessions |
| GitHub Integration | MCP Builder | Skill can publish MCPs to repos |
| Filesystem Access | Skill Creator | Skill can read/write skill files |
| Context7 | Frontend Design | Skill gets latest design system docs |

---

## Recommended Stack Patterns

### Pattern 1: Full-Stack Web Development

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT LAYER                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  Frontend    │ │   Backend    │ │    Code      │        │
│  │  Developer   │ │   Architect  │ │   Reviewer   │        │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘        │
│         │                │                │                 │
├─────────┼────────────────┼────────────────┼─────────────────┤
│         ▼                ▼                ▼                 │
│                    COMMAND LAYER                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Ultra Think  │ │    Commit    │ │   Generate   │        │
│  │              │ │              │ │    Tests     │        │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘        │
│         │                │                │                 │
├─────────┼────────────────┼────────────────┼─────────────────┤
│         ▼                ▼                ▼                 │
│                    HOOK LAYER                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Lint On Save │ │ Smart Commit │ │  Run Tests   │        │
│  │              │ │              │ │ After Change │        │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘        │
│         │                │                │                 │
├─────────┼────────────────┼────────────────┼─────────────────┤
│         ▼                ▼                ▼                 │
│                    MCP LAYER                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  Context7    │ │   GitHub     │ │  PostgreSQL  │        │
│  │              │ │ Integration  │ │ Integration  │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────┘

Synergy Score: 9/10
- All layers communicate effectively
- Automated quality gates
- Full development lifecycle coverage
```

### Pattern 2: API Development

```
┌─────────────────────────────────────────────────────────────┐
│  Backend Architect ──► Create Architecture Doc              │
│         │                      │                            │
│         ▼                      ▼                            │
│  Database Architect ──► Generate API Documentation          │
│         │                      │                            │
│         ▼                      ▼                            │
│  Security Scanner ◄── PostgreSQL Integration                │
│         │                      │                            │
│         ▼                      ▼                            │
│  Run Tests After Changes ◄── Memory Integration             │
└─────────────────────────────────────────────────────────────┘

Synergy Score: 8/10
```

### Pattern 3: Documentation-First

```
┌─────────────────────────────────────────────────────────────┐
│  Prompt Engineer ──► Create PRD                             │
│         │                 │                                 │
│         ▼                 ▼                                 │
│  Task Decomposition ──► Create Architecture Doc             │
│         │                 │                                 │
│         ▼                 ▼                                 │
│  Context Monitor ◄── Memory Integration                     │
│         │                 │                                 │
│         ▼                 ▼                                 │
│  Update Docs Hook ◄── GitHub Integration                    │
└─────────────────────────────────────────────────────────────┘

Synergy Score: 8/10
```

### Pattern 4: Testing-Focused

```
┌─────────────────────────────────────────────────────────────┐
│  Test Engineer ──────────► Generate Tests                   │
│         │                        │                          │
│         ▼                        ▼                          │
│  Debugger ───────────────► Run Tests After Changes          │
│         │                        │                          │
│         ▼                        ▼                          │
│  Code Reviewer ◄───────── Playwright MCP                    │
│         │                        │                          │
│         ▼                        ▼                          │
│  Webapp Testing Skill ◄── Context Monitor                   │
└─────────────────────────────────────────────────────────────┘

Synergy Score: 9/10
```

---

## Anti-Patterns (Avoid These)

### Redundant Combinations

| Components | Issue | Better Alternative |
|------------|-------|-------------------|
| Smart Commit + Commit Command | Both handle commits | Use Smart Commit hook only |
| Lint On Save + Format Python + Format JS | Over-formatting | Pick one formatter |
| Multiple notification hooks | Alert fatigue | Use Simple Notifications only |

### Conflicting Components

| Component A | Component B | Conflict |
|-------------|-------------|----------|
| Privacy Focused Setting | Memory Integration MCP | Memory requires some data sharing |
| File Protection Hook | Development Mode Setting | Protection may block valid edits |
| Disable Telemetry | Analytics-dependent tools | Some tools need telemetry |

### Missing Dependencies

| Component | Requires | Why |
|-----------|----------|-----|
| Smart Commit | Git installed | Needs git commands |
| PostgreSQL MCP | Database connection | Needs connection string |
| Playwright MCP | Node.js + browsers | Needs runtime environment |

---

## Effectiveness Scoring Formula

```
Total Score = (Coverage × 0.4) + (Synergy × 0.35) + (Efficiency × 0.25)

Coverage Score:
- Count project needs met by stack
- Score = (needs_met / total_needs) × 10

Synergy Score:
- Count positive synergies between components
- Subtract anti-patterns
- Score = ((synergies - anti_patterns) / max_possible_synergies) × 10

Efficiency Score:
- Check for redundancies
- Check for gaps
- Score = 10 - (redundancies × 1) - (gaps × 2)
```

---

## Quick Synergy Lookup

### Given an Agent, recommend:

| Agent | Best Commands | Best Hooks | Best MCPs |
|-------|--------------|------------|-----------|
| Frontend Developer | Create Feature, Refactor | Lint On Save, Smart Format | Context7, Figma |
| Backend Architect | Create Arch Doc, Containerize | Security Scanner | PostgreSQL, GitHub |
| Code Reviewer | Code Review, Ultra Think | Run Tests After Changes | GitHub |
| Test Engineer | Generate Tests | Run Tests After Changes | Playwright |
| DevOps Engineer | Containerize, Add Changelog | Build On Change | GitHub, Filesystem |

### Given a Command, recommend:

| Command | Best Agents | Best Hooks | Best Settings |
|---------|-------------|------------|---------------|
| Commit | Any | Smart Commit | Git Commit Settings |
| Generate Tests | Test Engineer | Run Tests After Changes | Development Mode |
| Ultra Think | Debugger, Prompt Engineer | - | Performance Optimization |
| Create Feature | Frontend/Backend Developer | Lint On Save | Development Mode |

### Given an MCP, recommend:

| MCP | Best Agents | Best Skills | Best Settings |
|-----|-------------|-------------|---------------|
| Context7 | Frontend Developer | Frontend Design | - |
| GitHub | DevOps Engineer | MCP Builder | Allow Git Operations |
| PostgreSQL | Database Architect | - | Development Mode |
| Memory | Any | Any | - |
| Playwright | Test Engineer | Webapp Testing | Bash Timeouts |

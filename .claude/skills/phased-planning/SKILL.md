---
name: phased-planning
description: Creates structured implementation plans with phase prompts for Claude Code execution. Use when building complex projects, creating implementation roadmaps, breaking work into phases, or generating Claude Code prompts for multi-step development. Triggers include "create implementation plan", "phase this project", "create phases for", "plan the build", "phased implementation", "break this into phases".
---

# Phased Planning Skill

Creates comprehensive phased implementation plans that generate copy-paste ready prompts for Claude Code execution, with success criteria and completion templates for each phase.

**Now supports Ralphy autonomous builds!**

## Triggers

- "create implementation plan"
- "phase this project"
- "create phases for"
- "plan the build"
- "phased implementation"
- "create Claude Code prompts"
- "break this into phases"
- "implementation roadmap"

---

## 🎯 Build Mode Selection

At the start of every phased plan, present this prompt:

```
╔══════════════════════════════════════════════════════════════════╗
║              🏗️  PHASED PLANNING - BUILD MODE                    ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  [1] 📋 Standard Mode - Manual phase-by-phase execution          ║
║      • Copy-paste prompts into Claude Code                       ║
║      • Full control over each phase                              ║
║      • Best for: Learning, complex decisions                     ║
║                                                                  ║
║  [2] 🤖 Ralphy Mode - ONE command, ALL phases, hands-off         ║
║      • Generate PRDs, run one command, walk away                 ║
║      • Automatic verification after each phase                   ║
║      • Best for: Fast builds, known patterns                     ║
║                                                                  ║
║  [3] 🔄 Hybrid Mode - Both outputs, maximum flexibility          ║
║      • Generate BOTH standard prompts AND Ralphy PRDs            ║
║      • Switch between manual/auto per phase as needed            ║
║      • Best for: Uncertain complexity, wanting options           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

Enter choice [1/2/3]: 
```

---

## Plan Naming Convention

Every phased plan receives a unique identifier:

```
PLAN-[KEYWORD]-[YYMMDD]
```

**Examples:**
- `PLAN-TRACKING-250125` - A tracking implementation plan
- `PLAN-MCP-SERVER-250125` - An MCP server build
- `PLAN-DASHBOARD-250125` - Dashboard development

**Store in `.env`:**
```env
CLAUDE_CODE_TASK_LIST_ID=PLAN-[KEYWORD]-[YYMMDD]
```

---

## Workflow

### Step 1: Project Analysis

Before creating phases, gather information:

```
1. Identify all components to build
2. Map dependencies between components
3. Determine optimal build order
4. Estimate phase complexity (3-12 tasks each)
5. Present BUILD MODE selection prompt
```

### Step 2: Create Master Plan

Generate `PLANNING/IMPLEMENTATION-MASTER-PLAN.md`:

```markdown
# [PROJECT NAME] - Implementation Master Plan

**Plan ID:** PLAN-[KEYWORD]-[YYMMDD]
**Created:** [DATE]
**Project Path:** [PATH]
**Runtime:** [TECHNOLOGY]
**Build Mode:** [Standard | Ralphy | Hybrid]

---

## Pre-Implementation Checklist

### ✅ Documentation (Complete)
| Component | Location | Status |
|-----------|----------|--------|
| [Doc 1] | [path] | ✅ |

### ⏳ Code Implementation (To Build)
| Component | Location | Status |
|-----------|----------|--------|
| [Component 1] | [path] | ⏳ |

---

## Implementation Phases Overview

| Phase | Name | Files | Dependencies |
|-------|------|-------|--------------|
| 0 | Project Setup | package.json, tsconfig | None |
| 1 | Core Infrastructure | src/lib/* | Phase 0 |
| ... | ... | ... | ... |
```

### Step 3: Generate Build Artifacts

Based on selected build mode:

#### Mode 1: Standard (Manual)
- Create `PLANNING/implementation-phases/PHASE-X-PROMPT.md` files
- Create `CLAUDE-CODE-PHASE-0.md` quick-start

#### Mode 2: Ralphy (Autonomous)
- Create `prd/` directory with all phase PRD files
- Create `.ralphy/config.yaml` configuration
- User runs ONE command to build everything

#### Mode 3: Hybrid (Both)
- Create ALL Standard mode files
- Create ALL Ralphy mode files
- User chooses execution method per phase or situation

---

## Standard Mode Output

### Phase Prompt Template

Create `PLANNING/implementation-phases/PHASE-X-PROMPT.md`:

```markdown
# Phase [X]: [NAME]

## Objective
[One sentence describing what this phase accomplishes]

---

## Prerequisites
- Phase [X-1] complete
- [Other requirements]

---

## Context Files to Read
```
[file1.md]
[file2.md]
```

---

## Tasks

### 1. [Task Name]
[Description]

```[language]
// Complete code specification
```

### 2. [Task Name]
...

---

## Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## Completion

Create `PHASE-[X]-COMPLETE.md` and commit:
```bash
git add -A
git commit -m "[PLAN-ID] Phase [X]: [NAME] complete"
```
```

### Standard Mode Execution

```bash
cd [project]
claude --dangerously-skip-permissions

# In Claude Code:
"Read PLANNING/implementation-phases/PHASE-X-PROMPT.md and execute all tasks"
```

---

## Ralphy Mode Output

### The Philosophy

Ralphy mode is **set it and forget it**:
1. Generate all PRD files upfront
2. Run ONE command
3. Ralphy executes all phases sequentially
4. Automatic verification after each phase
5. Walk away and come back to a built project

### PRD File Template

Create `prd/phase-X-[name].md` for each phase:

```markdown
# Phase [X]: [NAME]

## Overview
[Brief description of what this phase accomplishes]

## Dependencies
- Phase [X-1] complete

## Tasks

### [Category 1]
- [ ] [Task description with specific deliverable]
- [ ] [Task description with specific deliverable]
- [ ] [Task description with specific deliverable]

### [Category 2]
- [ ] [Task description with specific deliverable]
- [ ] [Task description with specific deliverable]

### Verification
- [ ] [Test/verify task]
- [ ] [Test/verify task]
```

### Ralphy Configuration

Create `.ralphy/config.yaml`:

```yaml
project:
  name: "[PROJECT-NAME]"
  language: "TypeScript"
  framework: "[FRAMEWORK]"

commands:
  test: "npm test"
  lint: "npm run lint"
  build: "npm run build"

rules:
  - "Follow existing code patterns"
  - "Create comprehensive documentation"
  - "Use TypeScript strict mode"
  - "[Project-specific rule]"

boundaries:
  never_touch:
    - "*.lock"
    - ".ralphy/**"
    - "[other protected files]"
```

### Ralphy Mode Execution

**ONE command to build everything:**

```bash
cd [project]
ralphy --prd prd/ -- --dangerously-skip-permissions
```

That's it. Ralphy will:
1. ✅ Execute Phase 0 → verify all checkboxes → commit
2. ✅ Execute Phase 1 → verify all checkboxes → commit
3. ✅ Execute Phase 2 → verify all checkboxes → commit
4. ✅ Continue until all phases complete
5. ✅ You come back to a finished project

### What Ralphy Does Automatically

- **Sequential execution** - Phases run in order (phase-0, phase-1, etc.)
- **Checkpoint verification** - Won't proceed until all checkboxes pass
- **Auto-commits** - Commits after each successful phase
- **Progress tracking** - Updates `.ralphy/progress.txt` in real-time
- **Error recovery** - Retries failed tasks before moving on

### Monitoring Progress

While Ralphy runs, you can watch:
```bash
# In another terminal
tail -f .ralphy/progress.txt
```

Or just check back later - Ralphy handles everything.

---

## Hybrid Mode

### When to Use Hybrid

Hybrid mode gives you both Standard prompts AND Ralphy PRDs. Use when:
- You're unsure which approach fits best
- Some phases need manual oversight, others can run autonomous
- You want to start with Ralphy but have fallback prompts
- Project complexity varies across phases

### Hybrid Execution Options

**Option A: Start with Ralphy, intervene if needed**
```bash
# Let Ralphy run
ralphy --prd prd/ -- --dangerously-skip-permissions

# If a phase fails or needs adjustment, switch to manual:
claude --dangerously-skip-permissions
# "Read PLANNING/implementation-phases/PHASE-2-PROMPT.md and execute"
```

**Option B: Manual for complex phases, Ralphy for simple ones**
```bash
# Phase 0-1: Run manually (complex setup decisions)
claude --dangerously-skip-permissions
# "Read PLANNING/implementation-phases/PHASE-0-PROMPT.md and execute"

# Phase 2+: Let Ralphy handle the rest
ralphy --prd prd/phase-2-core.md prd/phase-3-features.md -- --dangerously-skip-permissions
```

**Option C: Review PRDs, then decide**
```bash
# Look at generated PRDs
cat prd/phase-*.md

# Decide per phase which method to use
```

---

## File Organization

### Standard Mode
```
PROJECT/
├── PLANNING/
│   ├── IMPLEMENTATION-MASTER-PLAN.md
│   └── implementation-phases/
│       ├── PHASE-0-PROMPT.md
│       ├── PHASE-1-PROMPT.md
│       ├── PHASE-0-COMPLETE.md (after)
│       └── PHASE-1-COMPLETE.md (after)
├── CLAUDE-CODE-PHASE-0.md
└── CLAUDE.md
```

### Ralphy Mode
```
PROJECT/
├── PLANNING/
│   └── IMPLEMENTATION-MASTER-PLAN.md
├── prd/
│   ├── phase-0-setup.md
│   ├── phase-1-infrastructure.md
│   ├── phase-2-core.md
│   └── phase-3-features.md
├── .ralphy/
│   ├── config.yaml
│   └── progress.txt (auto-generated)
└── CLAUDE.md
```

### Hybrid Mode
```
PROJECT/
├── PLANNING/
│   ├── IMPLEMENTATION-MASTER-PLAN.md
│   └── implementation-phases/
│       ├── PHASE-0-PROMPT.md
│       ├── PHASE-1-PROMPT.md
│       └── PHASE-2-PROMPT.md
├── prd/
│   ├── phase-0-setup.md
│   ├── phase-1-infrastructure.md
│   └── phase-2-core.md
├── .ralphy/
│   └── config.yaml
├── CLAUDE-CODE-PHASE-0.md
└── CLAUDE.md
```

---

## Standard Phase Types

| Phase | Name | Purpose |
|-------|------|---------|
| 0 | Project Setup | package.json, tsconfig, dependencies, structure |
| 1 | Core Infrastructure | Config, logging, utilities, base clients |
| 2 | Framework | Base classes, types, patterns |
| 3 | Core Logic | Main business logic implementation |
| 4-N | Feature Phases | Individual features/components |
| Final | Integration | CLI, tests, end-to-end verification |

---

## Phase Sizing Guidelines

| Complexity | Tasks | Standard | Ralphy |
|------------|-------|----------|--------|
| Simple | 3-5 tasks | 10-20 min | 5-15 min |
| Medium | 5-8 tasks | 20-40 min | 15-30 min |
| Complex | 8-12 tasks | 40-60 min | 30-45 min |

**Rule:** If >12 tasks, split into sub-phases.

---

## Output Template

When creating a new phased plan, always output:

### 1. Build Mode Prompt
Present the interactive selection (shown above)

### 2. Plan Summary
```
📋 Plan Created: PLAN-[KEYWORD]-[YYMMDD]
📁 Project: [PROJECT NAME]
🔢 Phases: [N] phases
🏗️ Build Mode: [Standard | Ralphy | Hybrid]
```

### 3. Environment Variable
```env
CLAUDE_CODE_TASK_LIST_ID=PLAN-[KEYWORD]-[YYMMDD]
```

### 4. Quick Start Command

**Standard Mode:**
```bash
cd [project]
claude --dangerously-skip-permissions
# Then: "Read PLANNING/implementation-phases/PHASE-0-PROMPT.md and execute"
```

**Ralphy Mode:**
```bash
cd [project]
ralphy --prd prd/ -- --dangerously-skip-permissions
# That's it. Walk away.
```

**Hybrid Mode:**
```bash
cd [project]
# Option 1: Let Ralphy run all phases
ralphy --prd prd/ -- --dangerously-skip-permissions

# Option 2: Run specific phases manually
claude --dangerously-skip-permissions
# "Read PLANNING/implementation-phases/PHASE-X-PROMPT.md and execute"
```

### 5. Phase Files
[Generated prompts/PRDs based on selected mode]

---

## Best Practices

### All Modes
1. **Complete code in prompts** - Don't leave implementation to inference
2. **Explicit success criteria** - Checkboxes that can be verified
3. **Clear dependencies** - State what must be complete first
4. **Git commits per phase** - Clean history with plan ID prefix
5. **No time estimates** - Use phase order, not days/weeks
6. **Context files** - Always specify what to read first

### Ralphy-Specific
1. **Keep tasks atomic** - One clear deliverable per checkbox
2. **Use boundaries** - Protect files Ralphy shouldn't touch
3. **Name PRDs with numbers** - `phase-0-`, `phase-1-` for correct ordering
4. **Include verification tasks** - Ralphy checks these before proceeding
5. **Trust the process** - Let Ralphy run, check progress.txt if curious

### Hybrid-Specific
1. **Default to Ralphy** - Start autonomous, intervene only if needed
2. **Use Standard for decisions** - Complex architectural choices benefit from manual control
3. **Keep both in sync** - If you edit a PRD, update the matching prompt too

---

## When to Use Each Mode

| Scenario | Recommended Mode |
|----------|------------------|
| Learning a new codebase | Standard |
| Complex architectural decisions | Standard |
| Need to make choices mid-build | Standard |
| Quick prototype/MVP | Ralphy |
| Repetitive scaffolding | Ralphy |
| Known patterns, clear specs | Ralphy |
| Want to walk away | Ralphy |
| Maximum speed | Ralphy |
| Uncertain complexity | Hybrid |
| Mixed simple/complex phases | Hybrid |
| Want fallback options | Hybrid |

---

## Ralphy Installation

First time only:
```bash
npm install -g ralphy
```

Verify:
```bash
ralphy --version
```

---

## Integration

Works with:
- **organized-codebase-applicator** - For project structure
- **phase-0-template** - For quick project setup
- **tech-stack-orchestrator** - For component recommendations
- **Ralphy** - For autonomous PRD execution (https://github.com/michaelshimeles/ralphy)

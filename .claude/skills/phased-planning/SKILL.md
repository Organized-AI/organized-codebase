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

At the start of every phased plan, present this interactive prompt:

```
╔══════════════════════════════════════════════════════════════════╗
║              🏗️  PHASED PLANNING - BUILD MODE                    ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  How would you like to build this project?                       ║
║                                                                  ║
║  [1] 📋 Standard Mode (Manual Phase Execution)                   ║
║      - Generate phase prompts for copy-paste into Claude Code    ║
║      - Execute each phase manually with full control             ║
║      - Best for: Learning, complex decisions, custom workflows   ║
║                                                                  ║
║  [2] 🤖 Ralphy Mode (Autonomous PRD Execution)                   ║
║      - Generate PRD files with checkbox tasks                    ║
║      - Ralphy runs Claude Code in a loop until complete          ║
║      - Best for: Fast builds, parallel execution, hands-off      ║
║                                                                  ║
║  [3] 🔄 Hybrid Mode (Both Outputs)                               ║
║      - Generate both standard prompts AND Ralphy PRDs            ║
║      - Choose execution method per phase                         ║
║      - Best for: Flexibility, trying both approaches             ║
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
- Create `prd/phase-X-[name].md` PRD files
- Create `.ralphy/config.yaml` configuration
- Create `start-ralphy-build.sh` execution script

#### Mode 3: Hybrid (Both)
- Create all Standard mode files
- Create all Ralphy mode files
- User chooses per phase

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

### Execution

```bash
cd [project]
claude --dangerously-skip-permissions

# In Claude Code:
"Read PLANNING/implementation-phases/PHASE-X-PROMPT.md and execute all tasks"
```

---

## Ralphy Mode Output

### PRD File Template

Create `prd/phase-X-[name].md`:

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

### Testing
- [ ] [Verification task]
- [ ] [Verification task]
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

### Execution Script

Create `start-ralphy-build.sh`:

```bash
#!/bin/bash
# [PROJECT NAME] - Ralphy Build Script
# Plan ID: PLAN-[KEYWORD]-[YYMMDD]

set -e

PROJECT_DIR="[PROJECT_PATH]"

echo "🚀 [PROJECT NAME] - Ralphy Build"
echo "================================"

cd "$PROJECT_DIR"

# Check Ralphy is installed
if ! command -v ralphy &> /dev/null; then
    echo "Installing Ralphy..."
    npm install -g ralphy
fi

# Initialize if needed
if [ ! -d ".ralphy" ]; then
    echo "Initializing Ralphy..."
    ralphy --init
fi

# Phase selection
case "${1:-1}" in
    0) ralphy --prd prd/phase-0-setup.md -- --dangerously-skip-permissions ;;
    1) ralphy --prd prd/phase-1-infrastructure.md -- --dangerously-skip-permissions ;;
    2) ralphy --prd prd/phase-2-core.md -- --dangerously-skip-permissions ;;
    # Add more phases as needed
    all) ralphy --prd prd/ --parallel 3 -- --dangerously-skip-permissions ;;
    *)
        echo "Usage: $0 [0|1|2|...|all]"
        exit 1
        ;;
esac

echo "✅ Complete!"
```

### Execution

```bash
# Install Ralphy (one time)
npm install -g ralphy

# Run single phase
ralphy --prd prd/phase-1-infrastructure.md -- --dangerously-skip-permissions

# Run all phases in parallel
ralphy --prd prd/ --parallel 3 -- --dangerously-skip-permissions

# Or use the script
chmod +x start-ralphy-build.sh
./start-ralphy-build.sh 1      # Phase 1
./start-ralphy-build.sh all    # All phases (parallel)
```

---

## Ralphy Features

### Parallel Execution
Run multiple phases simultaneously:
```bash
ralphy --prd prd/ --parallel 4 -- --dangerously-skip-permissions
```

### Branch Per Task
Create separate branches and PRs:
```bash
ralphy --prd prd/phase-1.md --branch-per-task --create-pr
```

### Browser Automation
For web testing:
```bash
ralphy "test login flow" --browser
```

### Progress Tracking
Ralphy automatically:
- Tracks checkbox completion in PRD files
- Creates `.ralphy/progress.txt`
- Auto-commits on task completion

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
├── start-ralphy-build.sh
└── CLAUDE.md
```

### Hybrid Mode
```
PROJECT/
├── PLANNING/
│   ├── IMPLEMENTATION-MASTER-PLAN.md
│   └── implementation-phases/
│       ├── PHASE-0-PROMPT.md
│       └── PHASE-1-PROMPT.md
├── prd/
│   ├── phase-0-setup.md
│   └── phase-1-infrastructure.md
├── .ralphy/
│   └── config.yaml
├── start-ralphy-build.sh
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

## Completion Template

### Standard Mode
```markdown
# Phase [X]: [NAME] - COMPLETE

**Completed:** [DATE]
**Plan ID:** PLAN-[KEYWORD]-[YYMMDD]

## Deliverables
- [x] [File/feature 1]
- [x] [File/feature 2]

## Verification
- `[command 1]`: ✅
- `[command 2]`: ✅

## Next Phase
Proceed to Phase [X+1]: [NAME]
```

### Ralphy Mode
Ralphy auto-generates completion by marking all checkboxes in the PRD file.

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

### 4. Quick Start Commands

**Standard Mode:**
```bash
cd [project]
claude --dangerously-skip-permissions
# Then: "Read PLANNING/implementation-phases/PHASE-0-PROMPT.md and execute"
```

**Ralphy Mode:**
```bash
cd [project]
npm install -g ralphy  # if not installed
ralphy --prd prd/phase-0-setup.md -- --dangerously-skip-permissions
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
3. **Test parallel builds** - Start with 2-3 agents before scaling
4. **Monitor progress.txt** - Check Ralphy's progress tracking
5. **Use --branch-per-task** for PRs - Good for code review

---

## When to Use Each Mode

| Scenario | Recommended Mode |
|----------|------------------|
| Learning a new codebase | Standard |
| Complex architectural decisions | Standard |
| Quick prototype/MVP | Ralphy |
| Repetitive scaffolding | Ralphy |
| Mixed complexity phases | Hybrid |
| Team code review needed | Ralphy + `--create-pr` |
| Maximum speed | Ralphy + `--parallel` |

---

## Integration

Works with:
- **organized-codebase-applicator** - For project structure
- **phase-0-template** - For quick project setup
- **tech-stack-orchestrator** - For component recommendations
- **Ralphy** - For autonomous PRD execution

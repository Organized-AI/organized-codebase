---
name: tech-stack-orchestrator
description: |
  Comprehensive AI development stack orchestrator for analyzing, recommending, and creating Claude Code components. Use when: (1) Planning a new project and need tech stack recommendations, (2) Analyzing existing project requirements to suggest agents/commands/hooks/settings/MCPs/skills, (3) Creating custom Claude Code components of ANY type, (4) Evaluating effectiveness of tech stacks before building, (5) Building installation command sequences from component selections, (6) User says "orchestrate", "tech stack", "what components do I need", "create agent/hook/command/setting/skill/mcp", "analyze this project", or "recommend tools". This skill combines the capabilities of skill-creator and mcp-builder into a unified orchestration layer for the entire Claude Code ecosystem.
---

# Tech Stack Orchestrator

A meta-skill for orchestrating the complete Claude Code component ecosystem. Analyze projects, recommend components, create custom tools, and evaluate effectiveness before building.

## Component Taxonomy

Claude Code supports 6 component types, each serving distinct purposes:

| Type | Icon | Purpose | Location | Trigger |
|------|------|---------|----------|---------|
| **Agent** | 🤖 | Specialized AI personas with domain expertise | `.claude/agents/` | `/agent:name` or auto-detection |
| **Command** | ⚡ | Slash commands for quick actions | `.claude/commands/` | `/command-name` |
| **Setting** | ⚙️ | Configuration presets | `.claude/settings.json` | Auto-applied |
| **Hook** | 🪝 | Event-triggered automation | `.claude/hooks/` | Pre/post tool events |
| **MCP** | 🔌 | External service integrations | `.claude/mcp.json` | Tool availability |
| **Skill** | 🎨 | Complex capability packages | `.claude/skills/` | Context-triggered |

---

## Orchestration Workflow

### Phase 1: Project Analysis

When analyzing a project for tech stack recommendations:

```
1. GATHER: Collect project context
   - What type of project? (web app, CLI, API, mobile, etc.)
   - What technologies? (React, Python, Node, etc.)
   - What workflows? (git, CI/CD, testing, etc.)
   - What integrations? (databases, APIs, services)
   - Team size and experience level?

2. IDENTIFY: Determine needs by category
   - Development personas needed (agents)
   - Repetitive actions to automate (commands)
   - Environment configurations (settings)
   - Event-driven automations (hooks)
   - External service connections (MCPs)
   - Complex capability packages (skills)

3. MATCH: Map needs to existing components
   - Reference the component library (see references/component-library.md)
   - Identify gaps requiring custom components
   - Note synergies between components
```

### Phase 2: Stack Recommendation

Provide structured recommendations with effectiveness analysis:

```markdown
## Recommended Tech Stack for [Project Name]

### 🤖 Agents (n selected)
| Component | Why | Synergies |
|-----------|-----|-----------|
| [name] | [reasoning] | Works with [x, y] |

### ⚡ Commands (n selected)
...

### ⚙️ Settings (n selected)
...

### 🪝 Hooks (n selected)
...

### 🔌 MCPs (n selected)
...

### 🎨 Skills (n selected)
...

### Effectiveness Score: X/10
- Coverage: How well does this stack cover project needs?
- Synergy: How well do components work together?
- Efficiency: Are there redundancies or gaps?

### Installation Command
\`\`\`bash
npx organized-ai install [component-list]
\`\`\`
```

### Phase 3: Custom Component Creation

When existing components don't meet needs, create custom ones.

---

## Creating Custom Components

### 🤖 Creating Agents

Agents are specialized AI personas with domain expertise.

**File Structure:**
```
.claude/agents/
└── agent-name.md
```

**Agent Template:**
```markdown
---
name: agent-name
description: When to invoke this agent and what it specializes in
---

# Agent Name

## Role
[Define the persona and expertise]

## Responsibilities
- [Key responsibility 1]
- [Key responsibility 2]

## Guidelines
- [How the agent should behave]
- [What it should prioritize]

## Tools & Patterns
- [Preferred tools and workflows]
```

**Best Practices:**
- Use PROACTIVELY in description to indicate auto-invocation
- Keep focused on single domain
- Include concrete examples of when to activate

---

### ⚡ Creating Commands

Commands are slash-triggered actions for repetitive tasks.

**File Structure:**
```
.claude/commands/
└── command-name.md
```

**Command Template:**
```markdown
---
name: command-name
description: What this command does when invoked
---

# Command: /command-name

## Purpose
[What problem this solves]

## Usage
\`\`\`
/command-name [arguments]
\`\`\`

## Behavior
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Examples
- `/command-name file.ts` - [result]
```

**Best Practices:**
- Name should be action-oriented (verb-noun)
- Keep commands focused on single task
- Include clear argument documentation

---

### ⚙️ Creating Settings

Settings configure Claude Code behavior.

**File Structure:**
```
.claude/settings.json
```

**Settings Template:**
```json
{
  "permissions": {
    "allow": ["npm test", "npm run build"],
    "deny": ["rm -rf"]
  },
  "preferences": {
    "autoCommit": false,
    "lintOnSave": true
  },
  "environment": {
    "terminal": "zsh",
    "editor": "vscode"
  }
}
```

**Common Settings Categories:**
- `permissions`: Allow/deny bash commands
- `mcp`: MCP server configurations
- `statusline`: Custom status line display
- `telemetry`: Usage tracking preferences

---

### 🪝 Creating Hooks

Hooks are event-triggered automations.

**File Structure:**
```
.claude/hooks/
└── hook-name.md
```

**Hook Template:**
```markdown
---
name: hook-name
description: What this hook does and when it triggers
trigger: [PreToolUse|PostToolUse|PreMessage|PostMessage]
tools: [Edit|Write|Bash|*]  # Which tools trigger this
---

# Hook: hook-name

## Trigger Conditions
- Event: [when this fires]
- Filter: [which operations]

## Behavior
[What the hook does]

## Implementation
\`\`\`bash
#!/bin/bash
# Hook script
[commands]
\`\`\`
```

**Trigger Types:**
| Trigger | When |
|---------|------|
| `PreToolUse` | Before a tool executes |
| `PostToolUse` | After a tool completes |
| `PreMessage` | Before Claude responds |
| `PostMessage` | After Claude responds |

---

### 🔌 Creating MCPs

MCPs connect Claude to external services.

**For detailed MCP creation, load:** `references/mcp-creation-guide.md`

**Quick Reference - MCP Structure:**
```
mcp-name/
├── package.json
├── src/
│   └── index.ts
└── README.md
```

**MCP Configuration:**
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

**Key Considerations:**
- Use TypeScript with Zod for type safety
- Implement proper error handling with actionable messages
- Support pagination for list operations
- Include tool annotations (readOnly, destructive, idempotent)

---

### 🎨 Creating Skills

Skills are complex capability packages.

**For detailed skill creation, load:** `references/skill-creation-guide.md`

**Quick Reference - Skill Structure:**
```
skill-name/
├── SKILL.md (required)
├── scripts/     (optional - executable code)
├── references/  (optional - documentation)
└── assets/      (optional - templates, images)
```

**SKILL.md Template:**
```markdown
---
name: skill-name
description: Comprehensive description of what this skill does and when to use it. Include trigger phrases and contexts.
---

# Skill Name

## Overview
[What this skill enables]

## Workflow
1. [Step 1]
2. [Step 2]

## Resources
- scripts/tool.py - [purpose]
- references/guide.md - [when to load]
```

---

## Effectiveness Analysis

Before finalizing a tech stack, evaluate it:

### Coverage Matrix

```
Project Need          | Component          | Coverage
---------------------|--------------------|---------
[need 1]             | [component]        | ✅/⚠️/❌
[need 2]             | [component]        | ✅/⚠️/❌
```

### Synergy Analysis

Identify component pairs that enhance each other:
- Agent + Hook: Agent triggers hook for automation
- Command + Setting: Command uses setting configurations
- MCP + Skill: Skill leverages MCP for external data

### Gap Analysis

Identify what's missing:
- Uncovered needs requiring custom components
- Over-coverage where multiple components overlap
- Integration points that need bridging

### Scoring Rubric

| Score | Coverage | Synergy | Efficiency |
|-------|----------|---------|------------|
| 10 | 100% needs met | All components synergize | No redundancy |
| 7-9 | 80%+ needs met | Most synergize | Minor overlap |
| 4-6 | 50%+ needs met | Some synergy | Notable gaps |
| 1-3 | <50% needs met | Little synergy | Major issues |

---

## Quick Commands

### Analyze Project
```
Analyze this project and recommend a tech stack:
- Project type: [type]
- Technologies: [list]
- Key workflows: [list]
```

### Create Component
```
Create a [agent|command|setting|hook|mcp|skill] for:
- Purpose: [what it does]
- Trigger: [when it activates]
- Behavior: [how it works]
```

### Generate Installation
```
Generate installation command for:
- [component 1]
- [component 2]
- ...
```

---

## Reference Files

Load these as needed:

- **Component Library**: `references/component-library.md` - All 529+ available components
- **Skill Creation**: `references/skill-creation-guide.md` - Detailed skill creation
- **MCP Creation**: `references/mcp-creation-guide.md` - Detailed MCP creation
- **Synergy Matrix**: `references/synergy-matrix.md` - Component compatibility

---

## Installation

After creating components, install with:

```bash
# Single component
npx organized-ai install [type]:[category]/[name]

# Multiple components
npx organized-ai install agent:dev-team/frontend command:git/commit hook:auto/lint-on-save

# From stack file
npx organized-ai install --stack my-stack.json
```

---

## Packaging Custom Components

### Package a Skill
```bash
python3 /mnt/skills/examples/skill-creator/scripts/package_skill.py <skill-folder> /mnt/user-data/outputs
```

### Package for Distribution
Create a `.skill` file that can be uploaded to claude.ai/settings/capabilities.

Provide download link: `[Download](computer:///mnt/user-data/outputs/skill-name.skill)`

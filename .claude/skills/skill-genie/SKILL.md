---
name: skill-genie
description: Meta-skill that analyzes user prompts and recommends the most relevant skills to use. Triggers on queries about which skill to use, requests for skill suggestions, "what skill should I use", "help me pick a skill", "recommend a skill", at the start of complex tasks where skill selection would improve outcomes, or when the user seems unaware of available capabilities. Acts as a skill discovery and recommendation engine.
---

# Skill Genie 🧞

A meta-skill that analyzes user requests and recommends the most relevant skills from the available skill library.

## Purpose

Help users discover and leverage the right skills for their tasks by:
1. Analyzing the user's intent and requirements
2. Matching against available skills in the workspace
3. Recommending optimal skill combinations
4. Explaining why each skill is relevant

## Trigger Phrases

- "what skill should I use"
- "help me pick a skill"
- "recommend a skill"
- "which skill for..."
- "find the right skill"
- "skill suggestions"
- At the start of complex tasks where skill selection matters

## Workflow

### Step 1: Analyze Request

Parse the user's query to identify:
- **Task type**: creation, analysis, automation, documentation, etc.
- **Domain**: code, content, data, design, DevOps, etc.
- **Complexity**: single skill vs. multi-skill workflow
- **Output format**: file, artifact, report, script, etc.

### Step 2: Scan Available Skills

Check skill directories for matches:

```bash
# Local project skills
.claude/skills/

# User-level skills (Claude Desktop)
/mnt/skills/user/

# Public skills
/mnt/skills/public/

# Example skills
/mnt/skills/examples/
```

### Step 3: Match & Rank

Score each skill based on:
| Factor | Weight |
|--------|--------|
| Keyword match in description | 40% |
| Trigger phrase alignment | 30% |
| Domain relevance | 20% |
| Recency of use | 10% |

### Step 4: Recommend

Present recommendations in priority order:

```
🎯 Primary Recommendation: [skill-name]
   Why: [reason based on task analysis]
   
📌 Also Consider:
   1. [skill-2] - [brief reason]
   2. [skill-3] - [brief reason]

💡 Skill Combination:
   For this task, consider using [skill-1] → [skill-2] workflow
```

## Skill Discovery Commands

```bash
# List all available skills
ls -la .claude/skills/

# Search skill descriptions
grep -r "keyword" .claude/skills/*/SKILL.md

# Check skill triggers
head -20 .claude/skills/*/SKILL.md | grep -A5 "description:"
```

## Example Recommendations

### Request: "I need to organize my messy project"
```
🎯 Primary: organized-codebase-applicator
   Why: Matches "organize" + "project" keywords, handles cleanup and templating

📌 Also Consider:
   1. repo-manager - If GitHub operations needed
   2. tech-stack-orchestrator - For full stack analysis
```

### Request: "Create a presentation for sponsors"
```
🎯 Primary: hackathon-deck-builder
   Why: Specialized for sponsor/event presentations with SliDev

📌 Also Consider:
   1. /mnt/skills/public/pptx - For traditional PowerPoint
   2. frontend-design - For custom web-based slides
```

### Request: "Analyze my Instagram content performance"
```
🎯 Primary: content-insights
   Why: Built specifically for social media analytics with hook analysis

📌 Also Consider:
   1. data-audit - For deeper metrics analysis
   2. business-fin-analyst - For ROI calculations
```

## Integration with Other Skills

Skill Genie works best when combined with:

- **tech-stack-orchestrator**: For comprehensive project analysis
- **skill-creator-enhanced**: When no existing skill matches the need
- **repo-manager**: For skill installation and management

## Creating New Skills

If no skill matches the user's need:

```
❌ No matching skill found for: [task description]

💡 Recommendation: Create a new skill using skill-creator-enhanced

Would you like me to:
1. Create a custom skill for this task?
2. Suggest modifications to an existing skill?
3. Search for community skills?
```

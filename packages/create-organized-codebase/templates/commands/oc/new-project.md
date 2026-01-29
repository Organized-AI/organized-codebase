---
description: Initialize a new project with structured questioning and planning artifacts
---

# New Project Command

Guide structured project definition through questioning, then create planning artifacts.

## Phase 1: Vision Extraction

Ask questions until the vision is crystal clear. Do not proceed until confident.

**Core Questions:**

1. **What** are we building? (one sentence max)
2. **Who** is the primary user?
3. **Why** does this need to exist? (problem being solved)
4. **What** does success look like? (measurable outcomes)

**Clarifying Questions** (ask as needed):

- What's the MVP scope vs. future scope?
- Are there existing solutions? What's different about this?
- What are the hard constraints? (tech stack, timeline, budget)
- What's absolutely out of scope?

Keep asking until you could explain this project to someone else in 30 seconds.

## Phase 2: Requirements Gathering

Structure requirements into three categories:

### v1 Must-haves (MVP)
- Features required for first usable version
- Core functionality only
- What would make this "shippable"

### v2 Nice-to-haves
- Features for after initial launch
- Enhancements and polish
- "Would be nice but not blocking"

### Out of Scope
- Explicitly excluded features
- Things that might seem obvious but won't be built
- Future possibilities that aren't commitments

## Phase 3: Create Artifacts

Generate these files with the gathered information:

```
PLANNING/
├── PROJECT.md          # Vision, users, success metrics
├── REQUIREMENTS.md     # v1/v2/out-of-scope breakdown
├── ROADMAP.md          # Milestone breakdown with phases
└── STATE.md            # Current decisions and blockers
```

### PROJECT.md Template

```markdown
# [Project Name]

## Vision
[One sentence description]

## Problem Statement
[What problem does this solve?]

## Target User
[Who is this for?]

## Success Metrics
- [Measurable outcome 1]
- [Measurable outcome 2]

## Constraints
- [Tech stack, timeline, etc.]
```

### REQUIREMENTS.md Template

```markdown
# Requirements

## v1 - MVP
- [ ] [Feature 1]
- [ ] [Feature 2]

## v2 - Enhancement
- [ ] [Feature 3]
- [ ] [Feature 4]

## Out of Scope
- [Explicitly excluded thing 1]
- [Explicitly excluded thing 2]
```

## Phase 4: Initialize Config

Also create:

```
.claude/
└── settings.json       # Project-specific permissions
CLAUDE.md               # Project context for AI
```

## Phase 5: Confirm & Commit

Show summary and ask for confirmation:

```
╔══════════════════════════════════════════════════════════════╗
║     🚀 PROJECT INITIALIZED                                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Project: [Name]                                             ║
║  Vision:  [One-liner]                                        ║
║                                                              ║
║  Created:                                                    ║
║    ✓ PLANNING/PROJECT.md                                     ║
║    ✓ PLANNING/REQUIREMENTS.md                                ║
║    ✓ PLANNING/ROADMAP.md                                     ║
║    ✓ PLANNING/STATE.md                                       ║
║    ✓ .claude/settings.json                                   ║
║    ✓ CLAUDE.md                                               ║
║                                                              ║
║  Next: Run /oc:discuss to capture implementation decisions   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

Commit with:
```bash
git add PLANNING/ .claude/ CLAUDE.md
git commit -m "chore: Initialize project with Organized Codebase"
```

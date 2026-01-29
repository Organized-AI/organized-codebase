---
description: Capture implementation decisions before coding begins
---

# Discuss Command

Structured discussion to capture implementation decisions BEFORE writing code. This prevents mid-implementation pivots.

## Purpose

Every implementation has gray areas:
- API response format
- Error handling strategy
- Naming conventions
- Component structure
- Data flow patterns

This command surfaces and documents these decisions upfront.

## Discussion Flow

### Step 1: Identify the Feature

What feature or phase are we about to implement?

Read from:
- `PLANNING/REQUIREMENTS.md` - What needs to be built
- `PLANNING/ROADMAP.md` - Current phase focus

### Step 2: Surface Gray Areas

For the feature, ask about:

**Architecture**
- Where should this code live? (file structure)
- What patterns should we follow? (existing conventions)
- Any dependencies needed?

**Data**
- What's the data structure?
- How does it flow through the system?
- What's the API contract?

**Edge Cases**
- What happens when X fails?
- How do we handle empty states?
- What are the validation rules?

**UX (if applicable)**
- Loading states?
- Error messages?
- Success feedback?

### Step 3: Document Decisions

Create or update `PLANNING/STATE.md`:

```markdown
# Current State

## Active Feature: [Feature Name]

### Decisions Made
- [Decision 1]: [Rationale]
- [Decision 2]: [Rationale]

### Open Questions
- [Question that still needs answering]

### Blockers
- [Anything blocking progress]

---
Last updated: [timestamp]
```

### Step 4: Create Context File (Optional)

For complex features, create `PLANNING/CONTEXT-[feature].md`:

```markdown
# [Feature] Implementation Context

## Scope
[What's included, what's not]

## Technical Decisions
[Key decisions and why]

## File Structure
[Where code will live]

## Testing Strategy
[How we'll verify this works]
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                   DISCUSSION COMPLETE                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Feature: Password Reset Flow                                ║
║                                                              ║
║  Decisions Captured:                                         ║
║    ✓ Token expiry: 1 hour                                    ║
║    ✓ Email template: Use existing transactional system       ║
║    ✓ Rate limiting: 3 requests per hour per email            ║
║    ✓ UI: Modal with email input                              ║
║                                                              ║
║  Files Updated:                                              ║
║    • PLANNING/STATE.md                                       ║
║    • PLANNING/CONTEXT-password-reset.md                      ║
║                                                              ║
║  Next: Ready to implement. Run /verify when complete.        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Why This Matters

Without upfront discussion:
- Implementation starts, then pivots midway
- Context is lost between sessions
- Decisions are made implicitly and forgotten

With discussion:
- Clear plan before code is written
- Context persists across sessions
- Decisions are documented and reviewable

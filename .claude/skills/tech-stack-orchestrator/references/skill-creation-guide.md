# Skill Creation Guide

Detailed reference for creating custom skills. Skills are the most complex component type, packaging workflows, scripts, and domain knowledge into reusable capabilities.

---

## Skill Anatomy

```
skill-name/
├── SKILL.md           # Required: Main skill definition
├── scripts/           # Optional: Executable code
│   └── tool.py
├── references/        # Optional: Documentation loaded on-demand
│   └── guide.md
└── assets/            # Optional: Templates, images, files
    └── template.html
```

---

## SKILL.md Structure

### Required: YAML Frontmatter

```yaml
---
name: skill-name
description: |
  Comprehensive description of what this skill does.
  Include WHEN to use it with trigger phrases like:
  - "create a dashboard"
  - "analyze performance"
  - "generate report"
  This description is the PRIMARY triggering mechanism.
---
```

**Critical:** The description determines when the skill activates. Include:
- What the skill does
- Specific trigger phrases
- Contexts where it applies
- Keywords users might say

### Required: Markdown Body

```markdown
# Skill Name

## Overview
Brief explanation of the skill's purpose and capabilities.

## Workflow
1. Step one
2. Step two
3. Step three

## Resources
Reference bundled files:
- `scripts/tool.py` - [when to use]
- `references/api.md` - [load when needed]
- `assets/template.html` - [copy for output]
```

---

## Creating Different Skill Types

### Type 1: Workflow Skill

For multi-step processes that need guidance.

```markdown
---
name: code-review-workflow
description: Comprehensive code review process. Use when reviewing PRs, checking code quality, or auditing codebases. Triggers on "review this code", "check this PR", "audit quality".
---

# Code Review Workflow

## Process

### Step 1: Initial Scan
- Check file structure
- Identify main changes
- Note affected areas

### Step 2: Deep Analysis
- Review logic correctness
- Check error handling
- Evaluate performance implications

### Step 3: Report Generation
Generate structured report with:
- Summary of changes
- Issues found (critical/warning/info)
- Recommendations

## Checklist
- [ ] No security vulnerabilities
- [ ] Tests cover changes
- [ ] Documentation updated
- [ ] No breaking changes
```

### Type 2: Tool Skill

For skills that wrap executable scripts.

```markdown
---
name: pdf-processor
description: PDF manipulation including merge, split, extract text, fill forms. Use when working with PDF files. Triggers on "merge PDFs", "extract text from PDF", "fill PDF form".
---

# PDF Processor

## Available Operations

### Extract Text
```bash
python scripts/extract_text.py input.pdf
```

### Merge PDFs
```bash
python scripts/merge_pdfs.py file1.pdf file2.pdf -o output.pdf
```

### Split PDF
```bash
python scripts/split_pdf.py input.pdf --pages 1-5
```

## Scripts Reference
- `scripts/extract_text.py` - Text extraction with OCR fallback
- `scripts/merge_pdfs.py` - Combine multiple PDFs
- `scripts/split_pdf.py` - Extract page ranges
```

### Type 3: Knowledge Skill

For domain expertise and reference material.

```markdown
---
name: react-patterns
description: Modern React patterns and best practices. Use when building React components, optimizing performance, or implementing common UI patterns. Triggers on "React best practices", "how to structure React", "React performance".
---

# React Patterns

## Component Patterns

### Compound Components
For related components that share state:
```tsx
<Select>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

### Render Props
For sharing behavior:
```tsx
<DataFetcher url="/api/data">
  {({ data, loading }) => loading ? <Spinner /> : <List items={data} />}
</DataFetcher>
```

## Performance Patterns
- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Use `React.lazy` for code splitting

## See Also
- `references/hooks-guide.md` - Custom hooks patterns
- `references/state-management.md` - State architecture
```

### Type 4: Generator Skill

For creating output files from templates.

```markdown
---
name: component-generator
description: Generate React components with consistent structure. Use when creating new components. Triggers on "create component", "generate React component", "scaffold component".
---

# Component Generator

## Usage
Specify:
- Component name
- Component type (functional/class)
- Include tests? (yes/no)
- Include styles? (css/scss/styled-components)

## Output Structure
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.styles.ts
└── index.ts
```

## Templates
Copy and customize from:
- `assets/templates/FunctionalComponent.tsx`
- `assets/templates/ClassComponent.tsx`
- `assets/templates/Component.test.tsx`
- `assets/templates/Component.styles.ts`
```

---

## Bundled Resources

### Scripts (`scripts/`)

When to create scripts:
- Same code written repeatedly
- Deterministic operations needed
- Complex transformations

Script best practices:
```python
#!/usr/bin/env python3
"""
Script purpose and usage.

Usage:
    python script.py <input> [--option value]
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description='Script description')
    parser.add_argument('input', help='Input file')
    parser.add_argument('--option', default='default', help='Option description')
    args = parser.parse_args()
    
    # Implementation
    try:
        result = process(args.input, args.option)
        print(result)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
```

### References (`references/`)

When to create references:
- Detailed documentation too long for SKILL.md
- Multiple related guides
- Content loaded conditionally

Reference organization:
```
references/
├── quickstart.md      # Always load first
├── api-reference.md   # Load when doing API work
├── troubleshooting.md # Load when errors occur
└── examples.md        # Load for inspiration
```

Reference in SKILL.md:
```markdown
## Resources
- For API details, see `references/api-reference.md`
- For common issues, see `references/troubleshooting.md`
```

### Assets (`assets/`)

When to create assets:
- Templates to copy/modify
- Images for output
- Boilerplate code

Asset organization:
```
assets/
├── templates/
│   ├── component.tsx
│   └── test.tsx
├── images/
│   └── logo.png
└── boilerplate/
    └── project-starter/
```

---

## Progressive Disclosure

Keep SKILL.md under 500 lines. Split when larger:

**Pattern: High-level guide with references**
```markdown
# Skill Name

## Quick Start
[Essential workflow - 50 lines]

## Advanced Topics
- **Topic A**: See `references/topic-a.md`
- **Topic B**: See `references/topic-b.md`
```

**Pattern: Domain-specific split**
```
skill/
├── SKILL.md (navigation + core workflow)
└── references/
    ├── frontend.md (frontend-specific)
    ├── backend.md (backend-specific)
    └── database.md (database-specific)
```

---

## Writing Guidelines

### Use Imperative Form
```markdown
# Good
Extract the data from the file.
Run the validation script.

# Bad
You should extract the data from the file.
The next step is to run the validation script.
```

### Be Concise
```markdown
# Good
## Process
1. Parse input
2. Validate schema
3. Transform data
4. Output result

# Bad
## The Process You Should Follow
First, you need to parse the input file. This involves reading the file
and converting it to a format that can be processed. Once you have done
that, you should validate the schema...
```

### Include Examples
```markdown
# Good
## Usage
Create a dashboard:
```
/create-dashboard --type analytics --data sales.csv
```

Output:
```
Dashboard created: dashboard-analytics-2024.html
```

# Bad
## Usage
Run the command with appropriate parameters.
```

---

## Testing Skills

Before packaging, verify:

1. **Trigger Test**: Does the description capture all trigger phrases?
2. **Workflow Test**: Can you follow the steps successfully?
3. **Script Test**: Do all scripts execute without errors?
4. **Reference Test**: Are all referenced files present?
5. **Asset Test**: Are templates/assets correctly structured?

---

## Packaging

Package for distribution:
```bash
python3 /mnt/skills/examples/skill-creator/scripts/package_skill.py \
  /path/to/skill-folder \
  /mnt/user-data/outputs
```

Provide download link:
```markdown
## [Download skill-name.skill](computer:///mnt/user-data/outputs/skill-name.skill)

### Installation
1. Go to [claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Click "Upload skill"
3. Select the downloaded file
```

---

## Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Vague description | Skill doesn't trigger | Add specific trigger phrases |
| Too much in SKILL.md | Context bloat | Split into references |
| Missing examples | Hard to follow | Add concrete examples |
| Untested scripts | Runtime errors | Test all scripts |
| Duplicate info | Wasted tokens | Keep info in one place |

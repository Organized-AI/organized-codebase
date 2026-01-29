# Skill Authoring Best Practices

Comprehensive guidelines for writing effective Skills that Claude can discover and use successfully.

## Contents

- [Naming Conventions](#naming-conventions)
- [Writing Effective Descriptions](#writing-effective-descriptions)
- [Testing with All Models](#testing-with-all-models)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Content Guidelines](#content-guidelines)
- [MCP Tool References](#mcp-tool-references)
- [Checklist for Effective Skills](#checklist-for-effective-skills)

---

## Naming Conventions

Use consistent naming patterns to make Skills easier to reference and discuss.

**YAML `name` field requirements:**
- Maximum 64 characters
- Lowercase letters, numbers, and hyphens only
- No XML tags
- No reserved words: "anthropic", "claude"

**Recommended: Gerund form (verb + -ing)**

This clearly describes the activity or capability:

| Good Names | Why |
|------------|-----|
| `processing-pdfs` | Clear action |
| `analyzing-spreadsheets` | Descriptive |
| `managing-databases` | Specific domain |
| `testing-code` | Action-oriented |
| `writing-documentation` | Clear purpose |

**Acceptable alternatives:**
- Noun phrases: `pdf-processing`, `spreadsheet-analysis`
- Action-oriented: `process-pdfs`, `analyze-spreadsheets`

**Avoid:**
- Vague names: `helper`, `utils`, `tools`
- Overly generic: `documents`, `data`, `files`
- Reserved words: `anthropic-helper`, `claude-tools`
- Inconsistent patterns within your skill collection

---

## Writing Effective Descriptions

The `description` field enables Skill discovery. It's injected into the system prompt and Claude uses it to choose the right Skill from potentially 100+ available Skills.

### Critical Rule: Write in Third Person

**ALWAYS use third person.** Inconsistent point-of-view causes discovery problems.

| Good | Avoid |
|------|-------|
| "Processes Excel files and generates reports" | "I can help you process Excel files" |
| "Extracts text from PDF documents" | "You can use this to extract PDF text" |
| "Creates and manages database migrations" | "This skill helps with migrations" |

### Be Specific and Include Key Terms

Include both **what** the Skill does and **when** to use it.

**Effective examples:**

```yaml
# PDF Processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Excel Analysis
description: Analyze Excel spreadsheets, create pivot tables, generate charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.

# Git Commit Helper
description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.
```

**Avoid vague descriptions:**

```yaml
# Too vague - won't trigger properly
description: Helps with documents
description: Processes data
description: Does stuff with files
```

---

## Testing with All Models

Skills act as additions to models, so effectiveness depends on the underlying model. Test your Skill with all models you plan to use.

**Testing considerations by model:**

| Model | Focus Area |
|-------|------------|
| **Claude Haiku** (fast, economical) | Does the Skill provide enough guidance? |
| **Claude Sonnet** (balanced) | Is the Skill clear and efficient? |
| **Claude Opus** (powerful reasoning) | Does the Skill avoid over-explaining? |

What works perfectly for Opus might need more detail for Haiku. If planning to use across multiple models, aim for instructions that work well with all of them.

---

## Anti-Patterns to Avoid

### Windows-Style Paths

Always use forward slashes, even on Windows:

- **Good**: `scripts/helper.py`, `reference/guide.md`
- **Avoid**: `scripts\helper.py`, `reference\guide.md`

Unix-style paths work across all platforms.

### Offering Too Many Options

Don't present multiple approaches unless necessary:

**Bad - Confusing:**
```markdown
You can use pypdf, or pdfplumber, or PyMuPDF, or pdf2image, or...
```

**Good - Clear default with escape hatch:**
```markdown
Use pdfplumber for text extraction:
```python
import pdfplumber
```

For scanned PDFs requiring OCR, use pdf2image with pytesseract instead.
```

### Time-Sensitive Information

Don't include information that will become outdated:

**Bad:**
```markdown
If you're doing this before August 2025, use the old API.
After August 2025, use the new API.
```

**Good - Use "old patterns" section:**
```markdown
## Current method
Use the v2 API endpoint: `api.example.com/v2/messages`

## Old patterns
<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>
The v1 API used: `api.example.com/v1/messages`
This endpoint is no longer supported.
</details>
```

### Inconsistent Terminology

Choose one term and use it throughout the Skill:

| Consistent (Good) | Inconsistent (Bad) |
|-------------------|-------------------|
| Always "API endpoint" | Mix "API endpoint", "URL", "API route", "path" |
| Always "field" | Mix "field", "box", "element", "control" |
| Always "extract" | Mix "extract", "pull", "get", "retrieve" |

### Deeply Nested References

Keep references one level deep from SKILL.md:

**Bad - Too deep:**
```
SKILL.md → advanced.md → details.md → actual info
```

**Good - One level:**
```
SKILL.md
├── references/advanced.md
├── references/reference.md
└── references/examples.md
```

### Assuming Tools Are Installed

Don't assume packages are available:

**Bad:**
```markdown
Use the pdf library to process the file.
```

**Good:**
```markdown
Install required package: `pip install pypdf`

Then use it:
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```
```

---

## Content Guidelines

### Solve, Don't Punt

When writing scripts, handle error conditions rather than punting to Claude:

**Good - Handle errors explicitly:**
```python
def process_file(path):
    """Process a file, creating it if it doesn't exist."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"File {path} not found, creating default")
        with open(path, 'w') as f:
            f.write('')
        return ''
```

**Bad - Punt to Claude:**
```python
def process_file(path):
    # Just fail and let Claude figure it out
    return open(path).read()
```

### No "Voodoo Constants"

Configuration parameters should be justified and documented:

**Good - Self-documenting:**
```python
# HTTP requests typically complete within 30 seconds
REQUEST_TIMEOUT = 30

# Three retries balances reliability vs speed
MAX_RETRIES = 3
```

**Bad - Magic numbers:**
```python
TIMEOUT = 47  # Why 47?
RETRIES = 5   # Why 5?
```

---

## MCP Tool References

If your Skill uses MCP (Model Context Protocol) tools, always use fully qualified tool names:

**Format:** `ServerName:tool_name`

**Example:**
```markdown
Use the BigQuery:bigquery_schema tool to retrieve table schemas.
Use the GitHub:create_issue tool to create issues.
```

Without the server prefix, Claude may fail to locate the tool.

---

## Checklist for Effective Skills

### Core Quality
- [ ] Description is specific and includes key terms
- [ ] Description includes both what the Skill does and when to use it
- [ ] Description uses third person (not "I can" or "You can")
- [ ] SKILL.md body is under 500 lines
- [ ] Additional details are in separate files (if needed)
- [ ] No time-sensitive information (or in "old patterns" section)
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps

### Code and Scripts
- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] No "voodoo constants" (all values justified)
- [ ] Required packages listed in instructions and verified as available
- [ ] Scripts have clear documentation
- [ ] No Windows-style paths (all forward slashes)
- [ ] Validation/verification steps for critical operations
- [ ] Feedback loops included for quality-critical tasks

### Testing
- [ ] At least three evaluations created
- [ ] Tested with Haiku, Sonnet, and Opus (if using multiple models)
- [ ] Tested with real usage scenarios
- [ ] Team feedback incorporated (if applicable)

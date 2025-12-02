---
name: {{HOOK_NAME}}
description: {{DESCRIPTION}}
trigger: {{TRIGGER_TYPE}}
tools: {{TOOL_FILTER}}
---

# Hook: {{HOOK_NAME}}

## Overview

{{OVERVIEW_DESCRIPTION}}

## Trigger Configuration

| Property | Value |
|----------|-------|
| Event | `{{TRIGGER_TYPE}}` |
| Tools | `{{TOOL_FILTER}}` |
| Condition | {{CONDITION}} |

### Trigger Types Reference

- `PreToolUse` - Before a tool executes
- `PostToolUse` - After a tool completes
- `PreMessage` - Before Claude responds
- `PostMessage` - After Claude responds

### Tool Filters

- `*` - All tools
- `Edit` - File editing
- `Write` - File creation
- `Bash` - Command execution
- `[Edit, Write]` - Multiple specific tools

## Behavior

When triggered, this hook will:

1. {{BEHAVIOR_1}}
2. {{BEHAVIOR_2}}
3. {{BEHAVIOR_3}}

## Implementation

### Bash Script

```bash
#!/bin/bash
# {{HOOK_NAME}} hook script

{{BASH_IMPLEMENTATION}}
```

### Python Script (Alternative)

```python
#!/usr/bin/env python3
"""{{HOOK_NAME}} hook"""

{{PYTHON_IMPLEMENTATION}}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `{{ENV_VAR_1}}` | {{ENV_DESC_1}} | {{DEFAULT_1}} |

### Settings Integration

This hook works with these settings:
- {{RELATED_SETTING_1}}
- {{RELATED_SETTING_2}}

## Examples

### Example 1: {{EXAMPLE_1_NAME}}

Input:
```
{{EXAMPLE_1_INPUT}}
```

Hook action:
```
{{EXAMPLE_1_ACTION}}
```

Output:
```
{{EXAMPLE_1_OUTPUT}}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| {{ISSUE_1}} | {{SOLUTION_1}} |
| {{ISSUE_2}} | {{SOLUTION_2}} |

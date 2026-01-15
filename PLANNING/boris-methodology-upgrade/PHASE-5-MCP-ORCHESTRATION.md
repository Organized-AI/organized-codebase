# Phase 5: MCP Orchestration Layer

**Objective:** Use Claude Code as an orchestrator for all your tools via MCP

---

## Boris's Key Insights

> "In a way, Claude code has been one of the most badly named products from Anthropic because it's not only used for code."

> "The point is that it's a full system for people to control a lot of different workflows."

> "Claude pretty much uses all of his other tools for him as well. For instance, he uses Slack with Claude code using the MCP server along with a bunch of other tools like BigQuery and Sentry all through their CLIs inside Claude Code."

> "For me specifically, one of the biggest ways I use it in this orchestration is inside Notion where Claude connects to Notion via MCP."

---

## Current State

You have:
- Byterover MCP (knowledge storage) - already configured in CLAUDE.md
- Various skills that may use MCPs

Missing:
- Communication tools (Slack, Email)
- Data tools (BigQuery, databases)
- Project management (Notion, Asana)
- Monitoring (Sentry, logging)

---

## MCP Integration Categories

### Category 1: Communication
| Tool | MCP/CLI | Use Case |
|------|---------|----------|
| Slack | MCP | Team updates, notifications |
| Email | MCP | Sending reports, alerts |
| Discord | MCP | Community management |

### Category 2: Data & Analytics
| Tool | MCP/CLI | Use Case |
|------|---------|----------|
| BigQuery | CLI | Data analysis |
| PostgreSQL | MCP | Database operations |
| Firebase | CLI | App data |

### Category 3: Project Management
| Tool | MCP/CLI | Use Case |
|------|---------|----------|
| Notion | MCP | Documentation, databases |
| Asana | MCP | Task management |
| Linear | MCP | Issue tracking |
| GitHub | CLI/MCP | Code management |

### Category 4: Monitoring
| Tool | MCP/CLI | Use Case |
|------|---------|----------|
| Sentry | CLI | Error tracking |
| Datadog | CLI | Metrics |
| CloudWatch | CLI | AWS logs |

---

## Orchestration Patterns

### Pattern 1: Daily Standup Automation
```
Claude:
1. Check Slack for overnight messages
2. Review GitHub PRs and issues
3. Check Sentry for new errors
4. Summarize in Notion daily log
5. Post summary to Slack channel
```

### Pattern 2: Deployment Pipeline
```
Claude:
1. Run all verifications
2. Build and deploy
3. Monitor Sentry for errors
4. Post deployment notice to Slack
5. Update Notion changelog
```

### Pattern 3: Research & Documentation
```
Claude:
1. Query BigQuery for data
2. Analyze and summarize
3. Create Notion document
4. Share via Slack
```

---

## Implementation Strategy

### Step 1: Identify Your Tools
List tools you use daily:
- [ ] Communication: _________
- [ ] Data: _________
- [ ] Project Management: _________
- [ ] Monitoring: _________

### Step 2: Choose Integration Method

For each tool:
| Tool | MCP Available? | CLI Available? | Priority |
|------|----------------|----------------|----------|
| [Tool 1] | Yes/No | Yes/No | High/Med/Low |
| [Tool 2] | Yes/No | Yes/No | High/Med/Low |

### Step 3: Install MCPs

Common MCP servers:
```bash
# Slack MCP
npx @anthropic-ai/create-mcp-app slack

# Notion MCP
npx @anthropic-ai/create-mcp-app notion

# GitHub MCP (if not using CLI)
npx @anthropic-ai/create-mcp-app github
```

### Step 4: Configure in Claude Settings

Add to MCP configuration:
```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-slack"],
      "env": {
        "SLACK_TOKEN": "${SLACK_TOKEN}"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN}"
      }
    }
  }
}
```

---

## CLI Integration (Alternative to MCP)

For tools without MCPs, use CLIs:

```markdown
## CLI Tool Integration

### BigQuery
```bash
bq query --use_legacy_sql=false 'SELECT * FROM dataset.table'
```

### Sentry
```bash
sentry-cli issues list --project=myproject
```

### AWS
```bash
aws cloudwatch get-metric-statistics ...
```

Add these to allowed permissions in settings.json.
```

---

## Workflow Automation

### Create Orchestration Commands

Add to `.claude/commands/`:

**`/daily-standup.md`**
```markdown
# Daily Standup Automation

1. Check Slack #engineering for overnight messages
2. List open GitHub PRs needing review
3. Check Sentry for new errors (last 24h)
4. Summarize findings
5. Post summary to Slack #standup
```

**`/deploy.md`**
```markdown
# Deployment Orchestration

1. Run /verify to check code quality
2. Run /test for full test suite
3. Build for production
4. Deploy to [environment]
5. Monitor Sentry for 5 minutes
6. Post to Slack #deployments
7. Update Notion changelog
```

---

## Tasks

1. **Audit your tool stack**
   - List all tools you use daily
   - Identify which have MCPs vs CLIs

2. **Prioritize integrations**
   - Start with highest-value tools
   - Communication first (most immediate value)

3. **Install first MCP**
   - Choose one tool (recommend Slack or Notion)
   - Install and configure
   - Test basic operations

4. **Create orchestration commands**
   - `/daily-standup`
   - `/deploy`
   - `/weekly-report`

5. **Document in CLAUDE.md**
   - Available integrations
   - How to use each
   - Orchestration patterns

---

## Verification Checklist

- [ ] Tool audit completed
- [ ] At least 1 MCP installed and working
- [ ] CLI tools configured in permissions
- [ ] Orchestration commands created
- [ ] Integration tested end-to-end
- [ ] CLAUDE.md updated with integrations

---

## Prompt Template

```
Set up MCP orchestration:

1. Review the tools I commonly use
2. Install appropriate MCPs or configure CLIs
3. Create orchestration workflows
4. Add integration commands

Current tools in use: [list your tools]
Priority integrations: [list priorities]

Follow Boris's principle: Claude Code is an orchestrator, not just for code.
```

---

## Completion

When complete:
1. Test each integration
2. Run an orchestration workflow end-to-end
3. Git commit: "Phase 5: MCP orchestration layer"
4. Move to Phase 6

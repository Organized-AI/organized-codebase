# Claude Code Ecosystem Architecture

## Overview

The Claude Code ecosystem is a comprehensive AI-powered development platform composed of **seven interconnected component types** that work together to create intelligent, automated workflows.

## The Seven Component Types

```
┌────────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE ECOSYSTEM                        │
└────────────────────────────────────────────────────────────────┘
                              ↓
    ┌──────────────────────────────────────────────────────────┐
    │                  AI ORCHESTRATION LAYER                   │
    │                                                           │
    │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
    │  │   AGENTS    │  │  SUB-AGENTS  │  │    SKILLS      │  │
    │  │  (Coord.)   │←→│  (Execute)   │←→│  (Abilities)   │  │
    │  └─────────────┘  └──────────────┘  └────────────────┘  │
    │                                                           │
    └──────────────────────────────────────────────────────────┘
                              ↓
    ┌──────────────────────────────────────────────────────────┐
    │                 AUTOMATION & EXTENSION LAYER              │
    │                                                           │
    │  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │
    │  │  HOOKS   │  │ COMMANDS │  │  MCPs   │  │ SETTINGS │  │
    │  │ (Events) │  │ (Actions)│  │ (APIs)  │  │ (Config) │  │
    │  └──────────┘  └──────────┘  └─────────┘  └──────────┘  │
    │                                                           │
    └──────────────────────────────────────────────────────────┘
```

---

## Component Definitions

### 1. 🤖 Agents (AI Orchestrators)

**Purpose**: High-level AI specialists that coordinate complex workflows by possessing skills and spawning sub-agents.

**Characteristics**:
- Possess multiple skills
- Can spawn sub-agents
- Handle end-to-end workflows
- Make architectural decisions

**Examples**:
- Frontend Developer → Coordinates React development with code review, optimization, and testing
- Security Engineer → Orchestrates security audits, penetration tests, and compliance checks
- Data Engineer → Manages data pipelines, optimization, and documentation

**Installation**:
```bash
npx claude-code-templates@latest --agent development/frontend-developer --yes
```

**Relationship to Other Components**:
- **Has** Skills (capabilities they possess)
- **Spawns** Sub-Agents (workers they coordinate)
- **Invokes** Commands (via workflow steps)
- **Triggers** Hooks (through their actions)
- **Uses** MCPs (to access external data)
- **Respects** Settings (configuration constraints)

---

### 2. 🔧 Sub-Agents (Task Executors)

**Purpose**: Specialized autonomous workers that execute focused tasks spawned by parent agents.

**Characteristics**:
- Temporary, stateful execution
- Single-responsibility focus
- Use specific skills
- Report results to parent agent

**Examples**:
- code-reviewer → Performs code quality analysis
- test-generator → Creates comprehensive test suites
- security-scanner → Identifies vulnerabilities
- performance-analyzer → Optimizes performance

**Installation**:
```bash
npx claude-code-templates@latest --subagent code-quality/code-reviewer --yes
```

**Relationship to Other Components**:
- **Uses** Skills (to perform tasks)
- **Spawned by** Agents (parent orchestrators)
- **Can trigger** Hooks (through their operations)
- **May invoke** Commands (for specific actions)
- **Accesses** MCPs (for external data)
- **Follows** Settings (execution constraints)

---

### 3. 🎨 Skills (Capability Definitions)

**Purpose**: Reusable capability definitions that describe what agents and sub-agents can do.

**Characteristics**:
- Stateless templates
- Composable building blocks
- Define competencies
- Permanent and reusable

**Examples**:
- code-review → Quality checking capabilities
- data-analysis → Statistical analysis abilities
- api-integration → External API connection skills
- security-auditing → Vulnerability detection expertise

**Definition** (no installation, defined in data):
```javascript
{
  id: "code-review",
  name: "Code Review",
  type: "skill",
  capabilities: ["quality-check", "best-practices", "security-patterns"],
  complexity: "medium"
}
```

**Relationship to Other Components**:
- **Possessed by** Agents (who have the capability)
- **Used by** Sub-Agents (who execute with the capability)
- **Enhanced by** MCPs (external integrations add capabilities)
- **Scoped by** Settings (what skills can do)

---

### 4. 🪝 Hooks (Event-Driven Automation)

**Purpose**: Automation triggers that execute actions automatically when specific events occur.

**Characteristics**:
- Event-driven execution
- Run automatically in background
- No manual invocation needed
- Continuous monitoring

**Examples**:
- auto-git-add → Automatically stage changed files
- pre-commit-validation → Run quality checks before commits
- discord-notifications → Send alerts to Discord
- performance-monitor → Track system metrics

**Installation**:
```bash
npx claude-code-templates@latest --hook git/auto-git-add --yes
```

**Event Types**:
- **File changes** → Trigger on save, create, delete
- **Git operations** → Trigger on commit, push, merge
- **Test execution** → Trigger on test run, coverage change
- **Deployment** → Trigger on deploy, build, release

**Relationship to Other Components**:
- **Can spawn** Agents (for complex event handling)
- **May invoke** Sub-Agents (for focused tasks)
- **Often execute** Commands (slash commands)
- **Use** MCPs (to send notifications or access external services)
- **Respect** Settings (enabled/disabled state, permissions)

---

### 5. ⚡ Commands (User-Invoked Actions)

**Purpose**: Custom slash commands that automate specific development workflows on-demand.

**Characteristics**:
- User-invoked (not automatic)
- Single-purpose workflows
- Immediate execution
- Predictable outcomes

**Examples**:
- /generate-tests → Create test suites
- /security-audit → Run security scan
- /optimize-bundle → Optimize build
- /setup-testing → Initialize test framework

**Installation**:
```bash
npx claude-code-templates@latest --command testing/generate-tests --yes
```

**Usage**:
```
User types in Claude Code: /generate-tests
→ Command executes immediately
→ Returns results
```

**Relationship to Other Components**:
- **May invoke** Agents (for complex workflows)
- **Often spawn** Sub-Agents (for execution)
- **Require** Skills (capabilities to perform action)
- **Can trigger** Hooks (as side effects)
- **Use** MCPs (for external data access)
- **Follow** Settings (execution permissions)

---

### 6. 🔌 MCPs (Model Context Protocol - External Integrations)

**Purpose**: Connect Claude Code to external services, databases, and APIs for real-time data access.

**Characteristics**:
- Real-time data access
- External service integration
- Bidirectional communication
- Persistent connections

**Examples**:
- supabase → Database queries and operations
- github-integration → Repository and issue access
- playwright-mcp → Browser automation
- aws-integration → Cloud service control

**Installation**:
```bash
npx claude-code-templates@latest --mcp database/supabase --yes
```

**Configuration**:
```bash
# .env file
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

**Relationship to Other Components**:
- **Enhance** Skills (add new capabilities like "database-access")
- **Used by** Agents (to access external data during orchestration)
- **Accessed by** Sub-Agents (for focused external operations)
- **Invoked by** Commands (for data retrieval)
- **Triggered by** Hooks (for notifications or data sync)
- **Configured by** Settings (API keys, timeouts)

---

### 7. ⚙️ Settings (Configuration & Customization)

**Purpose**: Configuration files that control Claude Code behavior, performance, and security.

**Characteristics**:
- Control execution environment
- Define permissions
- Set performance parameters
- Customize interface

**Examples**:
- performance-optimization → Faster execution
- read-only-mode → Restrict file modifications
- git-branch-statusline → Display Git status
- bash-timeouts → Command execution limits

**Installation**:
```bash
npx claude-code-templates@latest --setting performance/performance-optimization --yes
```

**Configuration Location**:
```
.claude/settings/    → JSON configuration files
.claude/scripts/     → Python scripts (statuslines)
```

**Relationship to Other Components**:
- **Constrains** Agents (what they can access/modify)
- **Limits** Sub-Agents (execution permissions)
- **Enables/Disables** Hooks (automation control)
- **Configures** MCPs (API keys, timeouts)
- **Controls** Commands (available actions)
- **May require** Skills (for complex configurations)

---

## Integration Patterns

### Pattern 1: Complete AI Workflow

```
User Request
    ↓
Agent (has Skills) receives request
    ↓
Agent analyzes and creates plan
    ↓
Agent spawns Sub-Agents (each using specific Skills)
    ↓
Sub-Agents execute (may use MCPs for external data)
    ↓
Sub-Agents complete and report back
    ↓
Agent aggregates results
    ↓
Hooks trigger (e.g., git commit notification)
    ↓
Results returned to user
```

**Example**: E-Commerce Product Launch

```
User: "Launch new product on my site"
    ↓
Agent: E-Commerce Specialist
Skills: [product-writing, seo-optimization, market-research]
    ↓
Spawns Sub-Agents:
├── competitor-analyst (uses market-research skill + web scraping MCP)
├── product-writer (uses content-writing skill)
├── image-optimizer (uses image-processing skill)
└── seo-optimizer (uses seo-optimization skill)
    ↓
All complete and report results
    ↓
Hook triggers: auto-git-add stages changes
    ↓
Result: Complete product listing ready for deployment
```

### Pattern 2: Event-Driven Automation

```
Event occurs (file save, git commit, test run)
    ↓
Hook detects event
    ↓
Hook invokes Command or spawns Agent
    ↓
Agent/Command executes workflow
    ↓
May spawn Sub-Agents
    ↓
Uses MCPs for external actions
    ↓
Settings control execution constraints
    ↓
Results logged/reported
```

**Example**: Pre-Commit Quality Check

```
Developer runs: git commit
    ↓
Hook: pre-commit-validation triggers
    ↓
Hook invokes Command: /quality-check
    ↓
Command spawns Agent: Code Quality Manager
    ↓
Agent spawns Sub-Agents (parallel):
├── code-reviewer (checks code quality)
├── security-scanner (finds vulnerabilities)
├── test-runner (executes tests)
└── secrets-detector (scans for credentials)
    ↓
Sub-Agents use MCPs:
├── github-integration (check PR requirements)
└── supabase (log quality metrics)
    ↓
Settings enforced:
└── bash-timeouts (prevent hanging tests)
    ↓
Results aggregated
    ↓
If all pass: Commit proceeds
If failures: Commit blocked with detailed report
    ↓
Hook triggers: discord-notifications sends team alert
```

### Pattern 3: Command-Initiated Workflow

```
User types Command (e.g., /deploy)
    ↓
Command invokes Agent
    ↓
Agent creates deployment plan
    ↓
Agent spawns Sub-Agents (sequential + parallel)
    ↓
Sub-Agents use Skills and MCPs
    ↓
Hooks trigger throughout process
    ↓
Settings control permissions
    ↓
Final result delivered
```

**Example**: Production Deployment

```
User: /deploy-to-production
    ↓
Command: deploy-to-production
    ↓
Agent: DevOps Engineer
Skills: [devops, ci-cd, containerization, monitoring]
    ↓
Phase 1 (Parallel): Validation
├── code-reviewer (quality check)
├── security-scanner (vulnerability scan)
└── test-runner (run all tests)
    ↓
Settings check: read-only-mode = false (allows deployment)
    ↓
Phase 2 (Sequential): Build & Deploy
├── docker-optimizer (build optimized images)
│   Uses MCP: aws-integration (push to ECR)
├── infrastructure-provisioner (provision/update infra)
│   Uses MCP: aws-integration (Terraform apply)
└── deployment-manager (deploy to ECS)
    Uses MCP: aws-integration (ECS update service)
    ↓
Phase 3 (Parallel): Post-Deploy
├── smoke-tester (run smoke tests)
├── monitoring-setup (configure CloudWatch)
└── documentation-updater (update deployment docs)
    ↓
Throughout execution:
├── Hook: performance-monitor tracks deployment time
├── Hook: slack-notifications sends team updates
└── Hook: changelog-generator updates release notes
    ↓
Final Result: Deployment complete with metrics and notifications
```

### Pattern 4: MCP-Enhanced Workflow

```
Agent needs external data
    ↓
Agent uses MCP to access service
    ↓
MCP returns data
    ↓
Agent processes with Skills
    ↓
Agent spawns Sub-Agents with context
    ↓
Sub-Agents complete with enhanced data
```

**Example**: Database Optimization

```
User: "Optimize database performance"
    ↓
Agent: Database Administrator
Skills: [database-optimization, query-analysis, indexing]
    ↓
Agent uses MCP: supabase
├── Connects to database
├── Retrieves schema information
├── Analyzes query performance logs
└── Gets current index usage statistics
    ↓
Agent creates optimization plan
    ↓
Agent spawns Sub-Agents:
├── query-optimizer (optimizes slow queries)
│   Uses MCP: supabase (test query variations)
├── index-advisor (suggests new indexes)
│   Uses MCP: supabase (analyze query plans)
└── schema-analyzer (reviews table structures)
    Uses MCP: supabase (check relationships)
    ↓
Sub-Agents report findings
    ↓
Agent aggregates recommendations
    ↓
Agent uses MCP: supabase
└── Applies recommended indexes
    ↓
Hook: performance-monitor logs improvement metrics
    ↓
Result: Optimized database with performance report
```

---

## Interaction Matrix

| Component | Agents | Sub-Agents | Skills | Hooks | Commands | MCPs | Settings |
|-----------|--------|------------|--------|-------|----------|------|----------|
| **Agents** | - | Spawn | Possess | Trigger | Invoke | Use | Follow |
| **Sub-Agents** | Report to | - | Use | Trigger | Invoke | Use | Follow |
| **Skills** | Define | Define | Compose | - | - | Enhanced by | - |
| **Hooks** | Can spawn | Can spawn | - | - | Invoke | Use | Respect |
| **Commands** | Invoke | Spawn | Require | Trigger | - | Use | Follow |
| **MCPs** | Used by | Used by | Enhance | Used by | Used by | - | Configured by |
| **Settings** | Constrain | Constrain | - | Control | Control | Configure | - |

---

## Use Case Examples

### Use Case 1: Full-Stack Feature Development

**Goal**: Build a complete user authentication feature

**Components Used**:

1. **Command** → `/build-auth-feature` (user-invoked)
2. **Agent** → Fullstack Developer
   - **Skills**: frontend-development, backend-development, security, database-design
3. **Sub-Agents Spawned**:
   - api-designer → Design auth API
   - backend-developer → Implement API
   - frontend-developer → Build login UI
   - security-auditor → Review security
   - test-generator → Create tests
4. **MCPs Used**:
   - supabase → Database operations
   - github-integration → Create PR
5. **Hooks Triggered**:
   - auto-git-add → Stage changes
   - pre-commit-validation → Quality check
   - slack-notifications → Notify team
6. **Settings Applied**:
   - allow-git-operations → Enable git
   - bash-timeouts → Prevent hanging

**Workflow**:
```
/build-auth-feature
    ↓
Fullstack Developer Agent
    ↓
[Phase 1: Design]
api-designer → Creates API spec
    ↓
[Phase 2: Implementation (Parallel)]
├── backend-developer → Implements auth API
│   └── MCP: supabase (create auth tables)
└── frontend-developer → Builds login UI
    ↓
[Phase 3: Validation (Parallel)]
├── security-auditor → Security review
├── test-generator → Creates test suites
└── code-reviewer → Quality check
    ↓
[Hooks Execute]
├── auto-git-add → Stages all changes
├── pre-commit-validation → Runs quality checks
└── MCP: github-integration (creates PR)
    ↓
[Final Notification]
Hook: slack-notifications → Alerts team
    ↓
Result: Complete auth feature with PR created
```

### Use Case 2: Continuous Performance Monitoring

**Goal**: Monitor and optimize application performance automatically

**Components Used**:

1. **Hook** → performance-monitor (automatic, always running)
2. **Settings** → performance-optimization, bash-timeouts
3. **Agent** → Performance Engineer (spawned when issues detected)
   - **Skills**: performance-optimization, profiling, caching
4. **Sub-Agents**:
   - performance-analyzer → Identifies bottlenecks
   - cache-optimizer → Implements caching
   - bundle-optimizer → Reduces bundle size
5. **MCPs**:
   - aws-integration → CloudWatch metrics
   - github-integration → Create performance issues
6. **Commands** → /performance-report (manual trigger available)

**Workflow**:
```
[Continuous Monitoring]
Hook: performance-monitor (runs every 5 minutes)
├── MCP: aws-integration → Fetch CloudWatch metrics
└── Analyzes response times, memory usage
    ↓
[Issue Detected]
Response time > threshold
    ↓
Hook spawns Agent: Performance Engineer
    ↓
Agent analyzes metrics and code
    ↓
[Agent spawns Sub-Agents (Parallel)]
├── performance-analyzer
│   └── Profiles hot code paths
├── cache-optimizer
│   └── Identifies caching opportunities
└── bundle-optimizer
    └── Analyzes bundle size
    ↓
[Sub-Agents Report Findings]
Agent creates optimization plan
    ↓
[Implementation]
Agent applies optimizations
├── Implements caching
├── Optimizes queries
└── Reduces bundle size
    ↓
[Validation]
Hook: performance-monitor (verifies improvement)
    ↓
[Documentation]
MCP: github-integration → Creates issue with before/after metrics
    ↓
[Notification]
Hook: slack-notifications → Reports optimization completed
    ↓
Result: Automatically optimized performance with documentation
```

### Use Case 3: Security-First Development Workflow

**Goal**: Ensure all code changes meet security standards before merging

**Components Used**:

1. **Settings** → deny-sensitive-files, read-only-mode (for production files)
2. **Hook** → pre-commit-validation (automatic on git commit)
3. **Command** → /security-audit (manual deep scan)
4. **Agent** → Security Engineer
   - **Skills**: security-auditing, penetration-testing, compliance
5. **Sub-Agents**:
   - security-scanner → Vulnerability scanning
   - secrets-detector → Find exposed credentials
   - penetration-tester → Attack simulation
   - compliance-checker → Regulatory requirements
6. **MCPs**:
   - github-integration → PR security status
   - slack-integration → Security alerts

**Workflow**:
```
[Developer Commits Code]
git commit -m "Add user profile feature"
    ↓
[Hook Triggers]
Hook: pre-commit-validation
    ↓
[Settings Check]
Settings: deny-sensitive-files
└── Checks for .env, keys, credentials
    ↓
[If Secrets Detected]
├── Block commit
├── Hook: slack-integration → Alert security team
└── Display detailed error
    ↓
[If No Secrets]
Hook invokes Agent: Security Engineer
    ↓
[Agent spawns Sub-Agents (Parallel)]
├── security-scanner
│   └── Scans for OWASP Top 10 vulnerabilities
├── secrets-detector
│   └── Deep scan for credentials
└── dependency-auditor
    └── Checks npm packages for known CVEs
    ↓
[Quick Checks Complete (30 seconds)]
If critical issues found:
├── Block commit
└── Display issues with remediation steps
    ↓
If only warnings:
├── Allow commit
├── MCP: github-integration → Add security warnings to PR
└── Hook: slack-notifications → Notify security team
    ↓
[PR Created]
Developer opens PR
    ↓
[Full Security Audit]
Command: /security-audit (triggered by PR webhook)
    ↓
Agent: Security Engineer
└── Spawns additional Sub-Agents:
    ├── penetration-tester (tests attack vectors)
    ├── compliance-checker (validates GDPR, SOC2)
    └── code-reviewer (security patterns)
    ↓
[Full Audit Complete (5 minutes)]
Results posted to PR via MCP: github-integration
    ↓
[Final Approval]
If all checks pass:
└── PR approved for merge
    ↓
Result: Security-validated code merged with full audit trail
```

---

## Component Selection Guide

### When to Use Each Component

#### Use **Agents** when:
- Coordinating complex, multi-step workflows
- Combining multiple specialized tasks
- Making high-level decisions
- Orchestrating sub-agents
- **Example**: "Build a complete feature from design to deployment"

#### Use **Sub-Agents** when:
- Executing focused, specific tasks
- Parallelizing independent operations
- Reusing specialized capabilities
- Working within an agent's workflow
- **Example**: "Review this file for security issues" (as part of larger audit)

#### Use **Skills** when:
- Defining what capabilities exist
- Describing agent competencies
- Matching tasks to capable agents
- Building agent profiles
- **Example**: Define that "Frontend Developer" has "react" and "performance-optimization" skills

#### Use **Hooks** when:
- Automating repetitive tasks
- Responding to file/git events
- Continuous monitoring
- Team notifications
- No user action required
- **Example**: "Automatically run tests when files change"

#### Use **Commands** when:
- User needs to trigger specific workflow
- One-time operations
- On-demand automation
- Predictable, repeatable actions
- **Example**: "User types /deploy when ready to deploy"

#### Use **MCPs** when:
- Accessing external data/services
- Database operations
- API integrations
- Real-time information needed
- Browser automation
- **Example**: "Query Supabase database during workflow"

#### Use **Settings** when:
- Controlling behavior/permissions
- Performance optimization
- Security restrictions
- Interface customization
- Global configuration
- **Example**: "Set read-only mode for production files"

---

## Best Practices

### 1. Layered Architecture

```
User Interface Layer (Commands, Manual Triggers)
    ↓
Automation Layer (Hooks, Events)
    ↓
AI Orchestration Layer (Agents, Sub-Agents, Skills)
    ↓
Integration Layer (MCPs, External Services)
    ↓
Configuration Layer (Settings, Permissions)
```

### 2. Proper Component Interaction

✅ **DO**:
- Use Agents to coordinate multiple Sub-Agents
- Let Hooks trigger Commands for complex automation
- Use MCPs within Agent/Sub-Agent workflows for data
- Apply Settings globally to control all components
- Define Skills clearly and assign to appropriate Agents

❌ **DON'T**:
- Have Hooks directly spawn multiple Sub-Agents (use Agent instead)
- Bypass Settings with hardcoded permissions
- Create circular dependencies (Sub-Agent → Hook → Same Sub-Agent)
- Overload single Agent with too many Skills (split into specialized agents)
- Use Commands for event-driven automation (use Hooks instead)

### 3. Performance Optimization

**Model Selection**:
- **Haiku** for simple Sub-Agents (validation, formatting)
- **Sonnet** for complex Sub-Agents and all Agents
- **Opus** for critical architectural Agents only

**Parallelization**:
- Spawn independent Sub-Agents in parallel
- Use Hooks for async background tasks
- Leverage MCPs for concurrent external operations

**Resource Management**:
- Apply Settings like bash-timeouts and memory-optimization
- Cache MCP responses when appropriate
- Limit Sub-Agent spawning depth (max 3 levels)

### 4. Security Considerations

**Access Control**:
- Use Settings to restrict file access (read-only-mode, deny-sensitive-files)
- Apply security Settings before spawning Agents
- Validate MCP credentials securely (environment variables)

**Secret Management**:
- Never hardcode API keys (use MCPs with env vars)
- Use secrets-detector Sub-Agent in pre-commit Hooks
- Configure deny-sensitive-files Setting globally

**Audit Trail**:
- Use Hooks to log all Agent/Sub-Agent actions
- Send security alerts via MCP integrations
- Track command execution history

---

## Conclusion

The Claude Code ecosystem is a powerful, extensible platform where seven component types work together to create intelligent, automated development workflows:

1. **Skills** define capabilities
2. **Agents** orchestrate high-level workflows using skills
3. **Sub-Agents** execute focused tasks with skills
4. **Hooks** automate based on events
5. **Commands** provide user-triggered actions
6. **MCPs** integrate external services
7. **Settings** control behavior and permissions

By understanding how these components interact, you can build sophisticated automation that combines AI intelligence with event-driven automation, external integrations, and fine-grained control.

---

**Related Documentation**:
- [Sub-Agents vs Skills Architecture](./subagents-vs-skills-architecture.md)
- [Agent-Subagent Relationships](./agent-subagent-relationships.md)
- [Skill Stack Integration Guide](./skill-stack-integration.md)
- [AITMPL Components](./AITMPL/README.md)

**Version**: 1.0
**Last Updated**: October 30, 2025
**Status**: Complete Reference Architecture

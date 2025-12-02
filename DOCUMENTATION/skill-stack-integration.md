# Skill Stack Integration Guide

## Overview

This document explains how the **Skill Stack Analyzer** skill integrates with the Organized AI Marketplace architecture to help users understand and design agent workflows.

## Architecture Integration

### Three-Layer System

```
┌──────────────────────────────────────────────────────────────┐
│                    SKILL STACK ANALYZER                       │
│                  (Understanding & Design Layer)               │
│                                                               │
│  Helps users comprehend how the three layers work together   │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: SKILLS (Capability Definitions)                    │
│ • Documented in: AITMPL/components/skills.md                │
│ • Examples: data-analysis, code-review, api-integration     │
│ • Nature: Stateless, reusable, composable                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: AGENTS (Orchestrators)                             │
│ • Documented in: AITMPL/components/agents.md                │
│ • Examples: Frontend Developer, Security Engineer           │
│ • Possess skills, spawn sub-agents                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: SUB-AGENTS (Task Executors)                        │
│ • Documented in: AITMPL/components/subagents.md             │
│ • Examples: code-reviewer, test-generator                   │
│ • Use skills to accomplish focused tasks                    │
└─────────────────────────────────────────────────────────────┘
```

## How the Skill Stack Analyzer Works

### 1. Knowledge Integration

The Skill Stack Analyzer skill synthesizes knowledge from:

| Documentation Source | What It Provides | How Skill Uses It |
|---------------------|------------------|-------------------|
| `subagents-vs-skills-architecture.md` | Core distinction between sub-agents and skills | Explains the conceptual difference to users |
| `agent-subagent-relationships.md` | Spawning patterns and orchestration | Designs workflows with proper hierarchies |
| `AITMPL/components/skills.md` | Skill categories and examples | Identifies required skills for tasks |
| `AITMPL/components/agents.md` | Agent capabilities and specializations | Selects appropriate agents for workflows |
| `AITMPL/components/subagents.md` | Sub-agent types and use cases | Chooses optimal sub-agents to spawn |

### 2. Use Cases

#### A. Design New Workflows

**User Input:**
```
"I need to build a skill stack for automated code deployment"
```

**Skill Process:**
1. Analyzes requirements → Identifies needed capabilities
2. Maps capabilities → Skills (devops, ci-cd, security-auditing, testing)
3. Selects agent → DevOps Engineer (has required skills)
4. Designs sub-agent flow → code-reviewer, security-scanner, test-runner, docker-optimizer, etc.
5. Suggests execution pattern → Sequential with parallel groups
6. Estimates resources → Token budget, duration, costs

**Output:**
- Complete stack design
- Agent definition with skills
- Sub-agent workflow with dependencies
- Execution diagram
- Optimization suggestions

#### B. Analyze Existing Workflows

**User Input:**
```
"Analyze: Frontend Developer → code-reviewer → react-specialist → qa-expert"
```

**Skill Process:**
1. Parses workflow structure
2. Identifies skills being used
3. Evaluates execution pattern
4. Checks for missing skills/sub-agents
5. Finds optimization opportunities (parallelization, model selection)
6. Suggests improvements

**Output:**
- Current structure analysis
- Strengths and weaknesses
- Optimization recommendations
- Improved workflow design
- Cost/time savings estimates

#### C. Skill Gap Analysis

**User Input:**
```
"I want to build an AI chatbot. What skills and agents do I need?"
```

**Skill Process:**
1. Identifies domain requirements
2. Maps requirements to skills
3. Suggests primary agent (AI Engineer)
4. Lists supporting skills needed
5. Designs phased sub-agent workflow
6. Categorizes skills by priority (critical/important/nice-to-have)

**Output:**
- Required skills list
- Agent recommendation
- Sub-agent workflow across phases
- Learning path
- Resource estimates

## Integration with AITMPL Components

### Skills Component Integration

The Skill Stack Analyzer references AITMPL skills:

```javascript
// Example: Analyzing skill requirements
const requiredSkills = [
  "code-review",        // From AITMPL/components/skills.md → Quality & Security
  "api-integration",    // From AITMPL/components/skills.md → Development Skills
  "performance-optimization" // From AITMPL/components/skills.md → Quality & Security
];

// Skill Stack Analyzer explains:
// - What each skill does
// - Which agents possess it
// - Which sub-agents use it
// - Complexity and token estimates
```

### Agents Component Integration

References agent capabilities and spawning relationships:

```javascript
// Example: Agent selection
const agent = {
  name: "Frontend Developer",
  skills: ["frontend-development", "react", "ui-design"],
  canSpawnSubAgents: true,
  subAgentTemplates: [
    "code-reviewer",
    "react-specialist",
    "performance-engineer",
    "qa-expert"
  ]
};

// Skill Stack Analyzer uses this to:
// - Suggest appropriate agent for task
// - Show which sub-agents can be spawned
// - Design optimal orchestration
```

### Sub-Agents Component Integration

Understands sub-agent capabilities and characteristics:

```javascript
// Example: Sub-agent selection
const subagent = {
  name: "code-reviewer",
  type: "subagent-template",
  requiredSkills: ["code-review", "security-patterns"],
  recommendedModel: "claude-sonnet-4",
  estimatedDuration: "30-60 seconds"
};

// Skill Stack Analyzer uses this to:
// - Choose optimal sub-agents for subtasks
// - Estimate execution time and tokens
// - Suggest model selection (Haiku/Sonnet/Opus)
```

## Workflow Patterns Supported

### 1. Sequential Workflow

```
Agent spawns sub-agents one after another:

Agent: DevOps Engineer
├── 1. code-reviewer (analyze code quality)
├── 2. security-scanner (check vulnerabilities)
├── 3. test-runner (execute tests)
└── 4. deployment-manager (deploy to production)

Each waits for previous to complete.
```

### 2. Parallel Workflow

```
Agent spawns multiple sub-agents simultaneously:

Agent: Fullstack Developer
├── frontend-developer ─┐
├── backend-developer  ─┼─ Run in parallel
├── qa-expert          ─┤
└── docs-engineer      ─┘

Results aggregated when all complete.
```

### 3. Hierarchical Workflow

```
Agents spawn sub-agents, which spawn their own sub-agents:

Agent: Technical Lead
├── frontend-developer
│   ├── react-specialist
│   ├── performance-engineer
│   └── qa-expert
├── backend-developer
│   ├── api-designer
│   ├── security-auditor
│   └── database-optimizer
└── devops-engineer
    ├── docker-optimizer
    └── kubernetes-specialist

Multi-level coordination.
```

### 4. Conditional Workflow

```
Agent spawns sub-agents based on context:

Agent: Deployment Manager
├── code-reviewer (always)
├── IF security changes detected:
│   ├── security-auditor
│   └── IF critical vulnerabilities:
│       └── penetration-tester
├── test-runner (always)
└── deployment-executor (always)

Adaptive execution based on conditions.
```

## Practical Examples

### Example 1: E-Commerce Product Launch

**User Request**: "Design a workflow for launching new products on my e-commerce site"

**Skill Stack Analyzer Output**:

```markdown
# Skill Stack: E-Commerce Product Launch

## Agent: E-Commerce Specialist
**Skills**: product-writing, seo-optimization, market-research, image-optimization

## Sub-Agents Workflow

### Phase 1: Research (Parallel)
├── competitor-analyst
│   Skills: market-research, competitive-analysis
│   Task: Analyze competitor products and pricing
│   Model: Sonnet
│
└── market-researcher
    Skills: market-research, trend-analysis
    Task: Identify market trends and opportunities
    Model: Sonnet

### Phase 2: Content Creation (Sequential)
├── product-writer
│   Skills: content-writing, seo-optimization
│   Task: Write product description and copy
│   Model: Sonnet
│   Depends on: Phase 1 results
│
├── image-optimizer
│   Skills: image-processing, optimization
│   Task: Optimize product images
│   Model: Haiku
│
└── seo-optimizer
    Skills: seo-optimization, keyword-research
    Task: Optimize for search engines
    Model: Sonnet

### Phase 3: Validation (Parallel)
├── content-reviewer
│   Skills: editing, quality-assurance
│   Task: Review content quality
│   Model: Haiku
│
└── competitor-comparison
    Skills: competitive-analysis
    Task: Compare with competitor listings
    Model: Haiku

## Resource Estimates
- **Duration**: 3-6 minutes
- **Token Budget**: 18,000 tokens
- **Estimated Cost**: $0.27 (Sonnet/Haiku mix)

## Optimization Suggestions
- ✅ Parallelize Phase 1 research tasks (save 2 min)
- ✅ Use Haiku for image optimization (save tokens)
- ✅ Add A/B testing sub-agent for title optimization
```

### Example 2: Security Audit Workflow

**User Request**: "Analyze and optimize this security workflow: Security Engineer → security-scanner → manual review"

**Skill Stack Analyzer Output**:

```markdown
# Stack Analysis: Security Audit Workflow

## Current Issues
❌ No penetration testing
❌ No secrets detection
❌ Manual review bottleneck
❌ Sequential execution (slow)

## Optimized Stack

### Agent: Security Engineer
**Skills**: security-auditing, penetration-testing, compliance, threat-modeling

### Improved Workflow

**Parallel Group 1**: Quick Scans
├── security-scanner (vulnerability scanning)
├── secrets-detector (credential detection)
└── dependency-auditor (package vulnerabilities)

↓ (30 seconds)

**Parallel Group 2**: Deep Analysis
├── penetration-tester (attack simulation)
├── code-reviewer (security patterns)
└── compliance-checker (regulatory requirements)

↓ (90 seconds)

**Sequential**: Synthesis
└── knowledge-synthesizer (aggregate findings, prioritize issues)

↓ (15 seconds)

**Result**: Comprehensive security report

## Improvements
- ✅ Added penetration testing
- ✅ Added secrets detection
- ✅ Parallelized scans (60% faster)
- ✅ Automated synthesis (no manual review bottleneck)

## Impact
- **Before**: 4-5 minutes (sequential + manual)
- **After**: 2.5 minutes (parallel + automated)
- **Time Saved**: 45%
- **Token Cost**: +3K tokens (but comprehensive coverage)
```

## Best Practices for Using the Skill

### 1. Be Specific About Requirements

**Good**:
```
"Design a deployment workflow that includes:
- Code quality checks
- Security scanning
- Automated testing
- Docker optimization
- Infrastructure provisioning
- Monitoring setup"
```

**Better**:
```
"Design a deployment workflow for Node.js microservices to AWS ECS that includes:
- ESLint code quality checks
- OWASP security scanning
- Jest unit + integration tests
- Multi-stage Docker builds
- Terraform infrastructure provisioning
- CloudWatch monitoring with custom metrics
Target: < 5 min execution, minimize token usage"
```

### 2. Ask for Specific Analysis Types

| Analysis Type | Example Question |
|--------------|------------------|
| **Optimization** | "How can I reduce token usage in this stack?" |
| **Parallelization** | "Which sub-agents can run in parallel?" |
| **Cost Estimation** | "What will this workflow cost per execution?" |
| **Skill Gaps** | "What skills am I missing for this task?" |
| **Model Selection** | "Should I use Sonnet or Haiku for this sub-agent?" |
| **Comparison** | "Compare Frontend Developer vs Fullstack Developer for this task" |

### 3. Iterate and Refine

```
User: "Design a CI/CD pipeline"
Assistant: [Provides initial design]

User: "Can you add database migration checks?"
Assistant: [Updates design with migration sub-agent]

User: "Optimize for cost"
Assistant: [Suggests Haiku for simpler tasks, caching strategies]

User: "Show me the execution flow as a diagram"
Assistant: [Provides visual representation]
```

## Integration with Other Skills

### Checkpoint Skill Integration

```bash
# User workflow:
1. Use skill-stack-analyzer to design a workflow
2. Implement the workflow
3. Use checkpoint skill to document progress
4. Resume later using checkpoint
5. Use skill-stack-analyzer to optimize based on learnings
```

### Skill Creator Integration

```bash
# Creating new skills based on stack analysis:
1. Use skill-stack-analyzer to identify needed capabilities
2. Discover gaps in existing skills
3. Use skill-creator to define new custom skills
4. Add new skills to agent definitions
5. Re-analyze stack with new skills available
```

## Troubleshooting

### Common Issues

**Issue**: "The workflow is too slow"
**Solution**: Ask skill-stack-analyzer to identify parallelization opportunities

**Issue**: "Token usage is too high"
**Solution**: Ask skill-stack-analyzer to optimize model selection (use Haiku where possible)

**Issue**: "Results aren't comprehensive"
**Solution**: Ask skill-stack-analyzer to identify missing sub-agents or skills

**Issue**: "Don't know which agent to use"
**Solution**: Describe your task and ask skill-stack-analyzer to recommend an agent

## Performance Metrics

### Stack Complexity Matrix

| Complexity | Skills | Sub-Agents | Duration | Tokens | Models | Use Cases |
|-----------|--------|------------|----------|--------|--------|-----------|
| **Simple** | 1-3 | 1-2 | < 1 min | 2-5K | Haiku | Single file review, simple validation |
| **Standard** | 3-5 | 2-4 | 2-5 min | 8-15K | Haiku + Sonnet | Feature development, basic testing |
| **Complex** | 5-10 | 4-8 | 5-15 min | 20-40K | Sonnet | Full deployment, comprehensive audit |
| **Enterprise** | 10+ | 8-15 | 15-30 min | 50-100K | Sonnet + Opus | Multi-service architecture, complex orchestration |

## Future Enhancements

### Planned Features

1. **Dynamic Spawning**: AI-powered sub-agent selection based on task analysis
2. **Learning System**: Track successful patterns and suggest based on history
3. **Cost Optimizer**: Automatic model selection based on budget constraints
4. **Visual Builder**: Drag-and-drop skill stack designer
5. **Template Library**: Pre-built stack templates for common scenarios

### Community Contributions

Share your successful skill stacks with the community:

1. Design and test a workflow
2. Document in stack template format
3. Share on AITMPL marketplace
4. Others can reuse and improve

## Resources

### Documentation
- [Sub-Agents vs Skills Architecture](./subagents-vs-skills-architecture.md)
- [Agent-Subagent Relationships](./agent-subagent-relationships.md)
- [AITMPL Skills Reference](./AITMPL/components/skills.md)
- [AITMPL Agents Reference](./AITMPL/components/agents.md)
- [AITMPL Sub-Agents Reference](./AITMPL/components/subagents.md)

### Skills
- [Skill Stack Analyzer Skill](../.claude/skills/skill-stack-analyzer/SKILL.md)
- [Skill Stack Analyzer README](../.claude/skills/skill-stack-analyzer/README.md)

### External Resources
- [AITMPL Website](https://aitmpl.com/)
- [AITMPL Documentation](https://docs.aitmpl.com/)
- [Claude Agent SDK](https://docs.anthropic.com/claude/docs/agents)

## Conclusion

The Skill Stack Analyzer is a powerful tool for understanding and designing hierarchical AI workflows in the Organized AI Marketplace. By bridging the three architectural layers (Skills, Agents, Sub-Agents), it enables users to:

- ✅ Design efficient, comprehensive workflows
- ✅ Optimize for cost and performance
- ✅ Understand complex agent relationships
- ✅ Make informed architectural decisions

Whether you're building your first agent workflow or optimizing a complex enterprise system, the Skill Stack Analyzer provides the insights and guidance you need.

---

**Version**: 1.0
**Last Updated**: October 30, 2025
**Status**: Active
**Maintainer**: Organized AI Marketplace Team

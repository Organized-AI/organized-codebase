# Sub-Agents vs Skills: Architecture Definition

## 🎯 Core Distinction

This document establishes the clear architectural distinction between **Sub-Agents** (task-oriented entities) and **Skills** (capability definitions) in the Organized AI Marketplace.

---

## 📊 Quick Comparison

| Aspect | Sub-Agents | Skills |
|--------|-----------|--------|
| **Purpose** | Execute specific tasks | Define capabilities |
| **Lifespan** | Temporary, task-focused | Permanent, reusable |
| **Nature** | Instances/workers | Templates/definitions |
| **Example** | "Analyze this dataset" agent | "Data analysis" skill |
| **Deployment** | Spawned on-demand | Referenced/equipped |
| **State** | Stateful (task progress) | Stateless (capability only) |

---

## 🤖 Sub-Agents: Task-Oriented Entities

### Definition
Sub-agents are **autonomous AI entities** spawned to accomplish specific tasks. They are temporary workers with a focused mission.

### Characteristics
- **Task-Focused**: Created for a specific job
- **Autonomous**: Can complete work without constant supervision
- **Temporary**: Exist for the duration of their task
- **Stateful**: Track progress and maintain context
- **Hierarchical**: Can be spawned by parent agents
- **Result-Oriented**: Return specific outputs

### Lifecycle
```
1. Spawn     → Agent creates sub-agent with specific task
2. Initialize → Sub-agent receives context and instructions
3. Execute   → Sub-agent performs the task
4. Report    → Sub-agent returns results
5. Terminate → Sub-agent completes and releases resources
```

### Examples

#### Product Listing Sub-Agent
```javascript
{
  type: "subagent",
  task: "Create a product listing for Nike Air Max",
  capabilities: ["product-writing", "seo-optimization", "market-research"],
  status: "executing",
  progress: 65,
  spawnedBy: "ecommerce-specialist-agent",
  expectedOutput: "Complete product listing with title, description, specs"
}
```

#### Price Analysis Sub-Agent
```javascript
{
  type: "subagent",
  task: "Analyze competitor pricing for electronics category",
  capabilities: ["web-scraping", "data-analysis", "price-comparison"],
  status: "completed",
  result: {
    averagePrice: 299.99,
    competitors: 12,
    priceRange: [199.99, 499.99]
  }
}
```

### Use Cases
- Analyze a specific dataset
- Review code in a pull request
- Generate tests for a module
- Optimize a SQL query
- Create documentation for an API endpoint
- Perform security scan on auth module

---

## 🎨 Skills: Capability Definitions

### Definition
Skills are **capability definitions** that describe what an agent or sub-agent can do. They are the building blocks that define competencies.

### Characteristics
- **Capability-Focused**: Define what can be done
- **Permanent**: Exist in the marketplace persistently
- **Stateless**: Don't track execution state
- **Composable**: Can be combined and layered
- **Reusable**: Multiple agents can use the same skill
- **Descriptive**: Document abilities and requirements

### Components of a Skill
```javascript
{
  id: "data-analysis",
  name: "Data Analysis",
  type: "skill",
  description: "Ability to analyze datasets, identify patterns, and generate insights",
  capabilities: [
    "statistical-analysis",
    "data-visualization",
    "trend-identification",
    "anomaly-detection"
  ],
  tools: ["pandas", "numpy", "matplotlib"],
  models: ["claude-sonnet-4", "claude-opus-4"],
  prerequisites: ["python-basics", "statistics-fundamentals"],
  proficiencyLevels: ["beginner", "intermediate", "expert"]
}
```

### Examples

#### Content Writing Skill
```javascript
{
  id: "content-writing",
  name: "Content Writing",
  type: "skill",
  description: "Create engaging written content across various formats",
  capabilities: [
    "blog-writing",
    "technical-writing",
    "copywriting",
    "seo-optimization",
    "tone-adaptation"
  ],
  formats: ["articles", "blog-posts", "product-descriptions", "documentation"],
  languages: ["en", "es", "fr", "de"]
}
```

#### API Integration Skill
```javascript
{
  id: "api-integration",
  name: "API Integration",
  type: "skill",
  description: "Connect and integrate with external APIs",
  capabilities: [
    "rest-api-calls",
    "graphql-queries",
    "webhook-handling",
    "authentication",
    "error-handling",
    "rate-limiting"
  ],
  protocols: ["REST", "GraphQL", "WebSocket"],
  authMethods: ["OAuth", "JWT", "API-Key"]
}
```

### Use Cases
- Define what a role can do
- Filter agents by capability
- Build agent profiles
- Create skill requirements for tasks
- Match tasks to appropriate agents
- Skill-based pricing tiers

---

## 🔄 How They Work Together

### Marketplace Flow

```
User Request
    ↓
Task Definition
    ↓
Required Skills Identified ─────→ [Skills Database]
    ↓                                    ↓
Agent Selection (has skills)             ↓
    ↓                                    ↓
Sub-Agent Spawning ←────────────────────┘
    ↓
Task Execution (using skills)
    ↓
Results Returned
```

### Example Scenario: E-Commerce Product Launch

#### Step 1: User Request
```
"Launch a new product listing for my online store"
```

#### Step 2: Required Skills
```javascript
requiredSkills: [
  "product-writing",
  "seo-optimization",
  "image-optimization",
  "market-research",
  "competitive-analysis"
]
```

#### Step 3: Agent Selection
```javascript
selectedAgent: {
  id: "ecommerce-specialist",
  name: "E-Commerce Specialist",
  availableSkills: [
    "product-writing",
    "seo-optimization",
    "image-optimization",
    "market-research",
    "competitive-analysis",
    "pricing-strategy",
    "inventory-management"
  ]
}
```

#### Step 4: Sub-Agent Spawning
```javascript
spawnedSubAgents: [
  {
    id: "subagent-1",
    task: "Research competitor products",
    skills: ["market-research", "competitive-analysis"],
    model: "claude-sonnet-4",
    priority: "high"
  },
  {
    id: "subagent-2",
    task: "Write product description",
    skills: ["product-writing", "seo-optimization"],
    model: "claude-sonnet-4",
    priority: "high",
    dependsOn: ["subagent-1"]
  },
  {
    id: "subagent-3",
    task: "Optimize product images",
    skills: ["image-optimization"],
    model: "claude-haiku-4",
    priority: "medium"
  }
]
```

#### Step 5: Execution
```
Parallel Execution (Group 1):
├── Sub-Agent 1: Market Research → ✓ Completed
└── Sub-Agent 3: Image Optimization → ✓ Completed

Sequential Execution (Group 2):
└── Sub-Agent 2: Product Description → ✓ Completed
    (waited for Sub-Agent 1 results)
```

---

## 🏗️ Implementation in Marketplace

### Data Structure

#### Agents
```javascript
{
  id: "ecommerce-specialist",
  name: "E-Commerce Specialist",
  type: "agent",
  skills: [
    "product-writing",
    "seo-optimization",
    "market-research"
  ],
  canSpawnSubAgents: true,
  subAgentTemplates: [
    "competitor-analyst",
    "product-writer",
    "image-optimizer"
  ]
}
```

#### Sub-Agent Templates (What agents can spawn)
```javascript
{
  id: "competitor-analyst",
  name: "Competitor Analyst",
  type: "subagent-template",
  task: "Analyze competitor products and pricing",
  requiredSkills: ["market-research", "competitive-analysis"],
  recommendedModel: "claude-sonnet-4",
  estimatedDuration: "2-5 minutes",
  tokenBudget: 10000
}
```

#### Skills
```javascript
{
  id: "market-research",
  name: "Market Research",
  type: "skill",
  description: "Research market trends, competitors, and consumer behavior",
  category: "business-analysis",
  tools: ["web-search", "data-scraping", "trend-analysis"],
  outputFormats: ["reports", "charts", "summaries"]
}
```

### Visual Stack Builder

#### Before (Current)
```
[Agent] → [MCP] → [Command]
```

#### After (With Skills)
```
[Agent] ───→ [Skills Equipped]
    ↓              ↓
[Sub-Agent]   [Skills Used]
    ↓
[Result]
```

### UI Components

#### Agent Card
```html
<div class="agent-card">
  <h3>E-Commerce Specialist</h3>
  <div class="agent-skills">
    <span class="skill-badge">Product Writing</span>
    <span class="skill-badge">SEO Optimization</span>
    <span class="skill-badge">Market Research</span>
  </div>
  <div class="can-spawn">
    Can spawn: 3 sub-agent types
  </div>
</div>
```

#### Skill Card
```html
<div class="skill-card">
  <h3>Data Analysis</h3>
  <p>Analyze datasets and generate insights</p>
  <div class="skill-meta">
    <span>Used by: 24 agents</span>
    <span>Complexity: Medium</span>
  </div>
</div>
```

---

## 🎯 Key Design Principles

### 1. Separation of Concerns
- **Skills** define WHAT can be done
- **Sub-Agents** define WHO does it and WHEN
- **Agents** orchestrate the HOW

### 2. Composability
- Skills can be combined to create complex capabilities
- Sub-agents can use multiple skills
- Agents can spawn multiple sub-agents

### 3. Reusability
- Skills are defined once, used many times
- Sub-agent templates can be reused across agents
- Results can be cached and reused

### 4. Discoverability
- Skills are searchable and filterable
- Agents show their skill sets
- Sub-agent templates show skill requirements

### 5. Flexibility
- New skills can be added without changing agents
- Agents can acquire new skills
- Sub-agents can be dynamically configured

---

## 📈 Benefits of This Architecture

### For Users
- **Clear Understanding**: Know what each component does
- **Better Matching**: Find agents with the right skills
- **Transparent Costs**: See skill complexity and pricing
- **Predictable Results**: Understand capabilities upfront

### For Developers
- **Modular Design**: Easy to extend and maintain
- **Clear Contracts**: Well-defined interfaces
- **Testability**: Skills can be tested independently
- **Scalability**: Add new skills and sub-agents easily

### For the Marketplace
- **Skill-Based Search**: Filter by capabilities
- **Pricing Tiers**: Price based on skill complexity
- **Recommendation Engine**: Suggest agents based on needed skills
- **Quality Metrics**: Rate skills independently

---

## 🚀 Migration Path

### Phase 1: Add Skills Layer (Current Phase)
1. Define skill taxonomy
2. Create skill components in marketplace
3. Link existing agents to skills
4. Update UI to show skills

### Phase 2: Sub-Agent Templates
1. Convert existing sub-agents to templates
2. Define spawning rules and dependencies
3. Add skill requirements to templates
4. Create sub-agent orchestration UI

### Phase 3: Dynamic Spawning
1. Implement runtime sub-agent creation
2. Add task-to-skill matching
3. Build execution monitoring
4. Create result aggregation

### Phase 4: Advanced Features
1. Skill recommendations based on task
2. Auto-composition of sub-agents
3. Learning from execution patterns
4. Community skill creation

---

## 📋 Type Definitions

### TypeScript Interfaces

```typescript
// Skills - Capability Definitions
interface Skill {
  id: string;
  name: string;
  type: 'skill';
  description: string;
  category: string;
  capabilities: string[];
  tools?: string[];
  models?: string[];
  prerequisites?: string[];
  proficiencyLevels?: ('beginner' | 'intermediate' | 'expert')[];
  complexity: 'low' | 'medium' | 'high';
  estimatedTokens?: number;
}

// Sub-Agent Templates - What can be spawned
interface SubAgentTemplate {
  id: string;
  name: string;
  type: 'subagent-template';
  description: string;
  requiredSkills: string[]; // Skill IDs
  optionalSkills?: string[];
  recommendedModel: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDuration: string;
  tokenBudget: number;
  retryStrategy?: RetryConfig;
}

// Sub-Agent Instance - Runtime execution
interface SubAgentInstance {
  id: string;
  templateId: string;
  task: string;
  skills: Skill[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  spawnedBy: string; // Parent agent ID
  spawnedAt: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

// Agent with Skills
interface Agent {
  id: string;
  name: string;
  type: 'agent';
  description: string;
  skills: string[]; // Skill IDs
  canSpawnSubAgents: boolean;
  subAgentTemplates: string[]; // Template IDs
  maxConcurrentSubAgents?: number;
}
```

---

## 💡 Real-World Analogy

Think of it like a construction company:

### Skills = Certifications/Capabilities
- Carpentry
- Electrical work
- Plumbing
- Project management

### Agents = General Contractors
- Have multiple skills
- Can coordinate work
- Hire specialists

### Sub-Agents = Specialized Workers
- Hired for specific tasks
- Use specific skills
- Report back when done
- Get paid per job

### Example Construction Project
```
Project: Build a House
    ↓
General Contractor (Agent)
Skills: [project-management, carpentry, budgeting]
    ↓
Spawns Sub-Contractors (Sub-Agents):
├── Electrician (uses: electrical-work skill)
├── Plumber (uses: plumbing skill)
└── Carpenter (uses: carpentry skill)
    ↓
All complete their tasks
    ↓
General Contractor assembles final result
```

---

## 🎓 Summary

### Sub-Agents Are:
- ✅ Task executors
- ✅ Temporary workers
- ✅ Spawned on-demand
- ✅ Stateful and autonomous
- ✅ Result-oriented

### Skills Are:
- ✅ Capability definitions
- ✅ Permanent and reusable
- ✅ Composable building blocks
- ✅ Stateless templates
- ✅ Discoverable and searchable

### Together They Enable:
- ✅ Intelligent task decomposition
- ✅ Efficient resource allocation
- ✅ Clear capability mapping
- ✅ Flexible agent composition
- ✅ Scalable marketplace architecture

---

**Last Updated**: October 30, 2025
**Version**: 1.0
**Status**: Architecture Definition Complete

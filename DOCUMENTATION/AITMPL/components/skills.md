# Skills

Capability definitions that describe what agents and sub-agents can do in the Claude Agent SDK ecosystem. Browse and discover from **[aitmpl.com](https://aitmpl.com/)**.

## 🎨 What are Skills?

Skills are **reusable capability definitions** that describe what an AI agent can do. Unlike sub-agents (which are task executors), skills are the building blocks that define competencies, tools, and abilities.

### Think of Skills Like:
- **Professional Certifications**: "I can do electrical work"
- **Tool Proficiencies**: "I can use Python and TensorFlow"
- **Domain Knowledge**: "I understand e-commerce and SEO"
- **Process Capabilities**: "I can perform code reviews"

---

## 🔑 Key Characteristics

### 1. Capability-Focused
Skills define **what** can be done, not **who** does it or **when** it happens.

```javascript
{
  name: "Data Analysis",
  type: "skill",
  description: "Analyze datasets and generate insights",
  capabilities: [
    "statistical-analysis",
    "data-visualization",
    "trend-identification"
  ]
}
```

### 2. Stateless
Skills don't track execution state - they're pure definitions.

```javascript
// ❌ Skills DON'T have:
{
  progress: 45,
  status: "running",
  currentTask: "analyzing data"
}

// ✅ Skills DO have:
{
  capabilities: ["data-analysis"],
  tools: ["pandas", "numpy"],
  complexity: "medium"
}
```

### 3. Reusable
Multiple agents can possess the same skill.

```javascript
agents: [
  { name: "Data Scientist", skills: ["data-analysis"] },
  { name: "Business Analyst", skills: ["data-analysis"] },
  { name: "ML Engineer", skills: ["data-analysis"] }
]
```

### 4. Composable
Skills can be combined to create complex capabilities.

```javascript
{
  agent: "Full-Stack Developer",
  skills: [
    "frontend-development",
    "backend-development",
    "database-design",
    "api-integration"
  ]
}
```

---

## 📚 Skill Categories

### Development Skills

#### Frontend Development
**Capabilities**: React, Vue, Angular, UI/UX design, responsive layouts, accessibility
**Tools**: npm, webpack, vite, tailwind, styled-components
**Complexity**: Medium
**Used By**: Frontend Developer, Full-Stack Developer, UI Engineer

#### Backend Development
**Capabilities**: REST APIs, GraphQL, database integration, authentication, caching
**Tools**: Node.js, Express, FastAPI, Django, PostgreSQL
**Complexity**: Medium-High
**Used By**: Backend Developer, Full-Stack Developer, API Architect

#### Database Design
**Capabilities**: Schema design, query optimization, indexing, migrations, normalization
**Tools**: PostgreSQL, MySQL, MongoDB, Redis, Prisma
**Complexity**: Medium-High
**Used By**: Database Administrator, Backend Developer, Data Engineer

#### DevOps
**Capabilities**: CI/CD, containerization, orchestration, monitoring, infrastructure-as-code
**Tools**: Docker, Kubernetes, GitHub Actions, Terraform, Prometheus
**Complexity**: High
**Used By**: DevOps Engineer, SRE, Cloud Architect

---

### Data & AI Skills

#### Data Analysis
**Capabilities**: Statistical analysis, data visualization, trend identification, reporting
**Tools**: Python, pandas, numpy, matplotlib, seaborn
**Complexity**: Medium
**Used By**: Data Scientist, Data Analyst, ML Engineer

#### Machine Learning
**Capabilities**: Model training, feature engineering, hyperparameter tuning, evaluation
**Tools**: TensorFlow, PyTorch, scikit-learn, XGBoost
**Complexity**: High
**Used By**: ML Engineer, Data Scientist, AI Researcher

#### Natural Language Processing
**Capabilities**: Text analysis, sentiment analysis, entity recognition, language generation
**Tools**: spaCy, NLTK, transformers, Claude API
**Complexity**: High
**Used By**: NLP Engineer, AI Engineer, Data Scientist

#### Data Engineering
**Capabilities**: ETL pipelines, data warehousing, stream processing, data quality
**Tools**: Apache Spark, Airflow, Kafka, dbt, Snowflake
**Complexity**: High
**Used By**: Data Engineer, Analytics Engineer, Platform Engineer

---

### Quality & Security Skills

#### Code Review
**Capabilities**: Best practices checking, security scanning, performance analysis, style enforcement
**Tools**: ESLint, Prettier, SonarQube, static analyzers
**Complexity**: Medium
**Used By**: Code Reviewer, Tech Lead, QA Engineer

#### Security Auditing
**Capabilities**: Vulnerability scanning, penetration testing, compliance checking, threat modeling
**Tools**: OWASP ZAP, Burp Suite, Snyk, npm audit
**Complexity**: High
**Used By**: Security Engineer, Security Auditor, DevSecOps

#### Testing
**Capabilities**: Unit testing, integration testing, E2E testing, test automation, coverage analysis
**Tools**: Jest, Pytest, Cypress, Playwright, JUnit
**Complexity**: Medium
**Used By**: QA Engineer, Test Automation Engineer, Developer

#### Performance Optimization
**Capabilities**: Profiling, bottleneck identification, caching strategies, load testing
**Tools**: Lighthouse, Chrome DevTools, k6, JMeter, New Relic
**Complexity**: High
**Used By**: Performance Engineer, SRE, Senior Developer

---

### Business & Content Skills

#### Content Writing
**Capabilities**: Blog writing, technical writing, copywriting, SEO optimization, tone adaptation
**Formats**: Articles, documentation, product descriptions, marketing copy
**Complexity**: Low-Medium
**Used By**: Content Writer, Technical Writer, Marketing Manager

#### SEO Optimization
**Capabilities**: Keyword research, on-page SEO, link building, technical SEO, analytics
**Tools**: Google Analytics, Search Console, Ahrefs, SEMrush
**Complexity**: Medium
**Used By**: SEO Specialist, Digital Marketer, Content Strategist

#### Market Research
**Capabilities**: Competitive analysis, trend analysis, consumer behavior, pricing strategy
**Tools**: Web scraping, surveys, analytics platforms, research databases
**Complexity**: Medium
**Used By**: Market Researcher, Product Manager, Business Analyst

#### Project Management
**Capabilities**: Planning, resource allocation, risk management, stakeholder communication
**Tools**: Jira, Asana, Monday, Gantt charts, burndown charts
**Complexity**: Medium
**Used By**: Project Manager, Scrum Master, Team Lead

---

## 🏗️ Skill Structure

### Basic Skill Definition

```javascript
{
  id: "data-analysis",
  name: "Data Analysis",
  type: "skill",
  description: "Analyze datasets, identify patterns, and generate insights",
  category: "data-ai",

  // Core capabilities this skill provides
  capabilities: [
    "statistical-analysis",
    "data-visualization",
    "trend-identification",
    "anomaly-detection",
    "report-generation"
  ],

  // Tools/technologies used
  tools: [
    "python",
    "pandas",
    "numpy",
    "matplotlib",
    "seaborn"
  ],

  // Compatible AI models
  models: [
    "claude-sonnet-4",
    "claude-opus-4"
  ],

  // Skill complexity
  complexity: "medium",

  // Estimated tokens for typical use
  estimatedTokens: 5000,

  // Skills needed before this one
  prerequisites: [
    "python-basics",
    "statistics-fundamentals"
  ],

  // Proficiency levels
  proficiencyLevels: ["beginner", "intermediate", "expert"]
}
```

### Advanced Skill with Dependencies

```javascript
{
  id: "fullstack-web-development",
  name: "Full-Stack Web Development",
  type: "skill",
  description: "Build complete web applications from frontend to backend",
  category: "development",

  // This is a composite skill
  composedOf: [
    "frontend-development",
    "backend-development",
    "database-design",
    "api-integration",
    "deployment"
  ],

  capabilities: [
    "react-development",
    "node-api-development",
    "database-integration",
    "authentication",
    "deployment-automation"
  ],

  tools: [
    "react",
    "node.js",
    "express",
    "postgresql",
    "docker",
    "github-actions"
  ],

  models: ["claude-sonnet-4", "claude-opus-4"],
  complexity: "high",
  estimatedTokens: 15000,

  prerequisites: [
    "frontend-development",
    "backend-development",
    "database-design"
  ],

  proficiencyLevels: ["intermediate", "expert"]
}
```

---

## 🔄 How Skills Work with Agents

### Agent Skill Assignment

```javascript
{
  agent: {
    id: "ecommerce-specialist",
    name: "E-Commerce Specialist",
    type: "agent",

    // Skills this agent possesses
    skills: [
      "product-writing",
      "seo-optimization",
      "market-research",
      "image-optimization",
      "pricing-strategy"
    ],

    // Can spawn sub-agents
    canSpawnSubAgents: true,

    // Sub-agent templates this agent can use
    subAgentTemplates: [
      "competitor-analyst",
      "product-writer",
      "seo-optimizer"
    ]
  }
}
```

### Sub-Agent Skill Requirements

```javascript
{
  subagent: {
    id: "competitor-analyst",
    name: "Competitor Analyst",
    type: "subagent-template",

    // Skills required to execute this sub-agent
    requiredSkills: [
      "market-research",
      "competitive-analysis",
      "data-analysis"
    ],

    // Skills that enhance capability
    optionalSkills: [
      "web-scraping",
      "price-analysis"
    ],

    recommendedModel: "claude-sonnet-4",
    estimatedDuration: "2-5 minutes"
  }
}
```

### Skill-Based Task Matching

```javascript
// User task
const task = "Analyze competitor pricing for electronics";

// Required skills identified
const requiredSkills = [
  "market-research",
  "competitive-analysis",
  "price-analysis"
];

// Find agents with these skills
const matchingAgents = agents.filter(agent =>
  requiredSkills.every(skill => agent.skills.includes(skill))
);

// Result: E-Commerce Specialist, Market Researcher, Business Analyst
```

---

## 🎯 Skill Discovery & Filtering

### Search by Skill

```javascript
// UI Component
<SkillFilter>
  <input
    placeholder="Search skills..."
    onChange={(e) => filterBySkill(e.target.value)}
  />
</SkillFilter>

// Results show agents with matching skills
```

### Filter Agents by Capability

```javascript
// Show only agents with "data-analysis" skill
const dataAgents = agents.filter(agent =>
  agent.skills.includes("data-analysis")
);

// Result: Data Scientist, ML Engineer, Business Analyst
```

### Skill Recommendations

```javascript
// Based on task complexity
if (taskComplexity === "high") {
  recommendedSkills = [
    "advanced-problem-solving",
    "system-design",
    "performance-optimization"
  ];
}

// Suggest agents with these skills
const suggestedAgents = agents
  .filter(agent =>
    recommendedSkills.every(skill => agent.skills.includes(skill))
  )
  .sort((a, b) => b.rating - a.rating);
```

---

## 📊 Skill Complexity & Pricing

### Complexity Levels

#### Low Complexity
- **Examples**: Content writing, basic formatting, simple searches
- **Token Range**: 1,000 - 3,000
- **Model**: Haiku or Sonnet
- **Cost**: $0.003 - $0.009 per use

#### Medium Complexity
- **Examples**: Code review, data analysis, API integration
- **Token Range**: 3,000 - 10,000
- **Model**: Sonnet
- **Cost**: $0.009 - $0.03 per use

#### High Complexity
- **Examples**: System architecture, ML training, security auditing
- **Token Range**: 10,000 - 50,000
- **Model**: Opus or Sonnet
- **Cost**: $0.03 - $0.75 per use

### Pricing by Skill

```javascript
const skillPricing = {
  "content-writing": { complexity: "low", avgCost: 0.005 },
  "code-review": { complexity: "medium", avgCost: 0.015 },
  "system-design": { complexity: "high", avgCost: 0.40 },
  "ml-training": { complexity: "high", avgCost: 0.60 }
};
```

---

## 🚀 Creating Custom Skills

### Step 1: Define the Skill

```javascript
{
  id: "custom-skill-csv-processing",
  name: "CSV Processing",
  type: "skill",
  description: "Parse, validate, and transform CSV files",
  category: "data-processing",

  capabilities: [
    "csv-parsing",
    "data-validation",
    "format-conversion",
    "error-handling"
  ],

  tools: ["python", "pandas", "csv"],
  models: ["claude-haiku-4", "claude-sonnet-4"],
  complexity: "low",
  estimatedTokens: 2000,
  prerequisites: ["python-basics"],
  proficiencyLevels: ["beginner", "intermediate"]
}
```

### Step 2: Add to Marketplace

```javascript
// In data.js or marketplace data
const customSkills = [
  {
    id: "csv-processing",
    name: "CSV Processing",
    icon: "📊",
    description: "Parse and transform CSV files",
    category: "data-processing",
    tags: ["csv", "data", "parsing", "transformation"],
    complexity: "low"
  }
];
```

### Step 3: Assign to Agents

```javascript
{
  agent: {
    id: "data-engineer",
    name: "Data Engineer",
    skills: [
      "csv-processing", // Your custom skill
      "data-analysis",
      "database-design"
    ]
  }
}
```

---

## 💡 Best Practices

### 1. Single Responsibility
Each skill should focus on one clear capability.

```javascript
// ✅ Good: Focused skill
{
  name: "API Authentication",
  capabilities: ["jwt-auth", "oauth", "api-key-management"]
}

// ❌ Bad: Too broad
{
  name: "Backend Everything",
  capabilities: ["api", "database", "auth", "caching", "queues", "..."]
}
```

### 2. Clear Prerequisites
Define what's needed before acquiring this skill.

```javascript
{
  name: "Machine Learning",
  prerequisites: [
    "python-programming",
    "statistics",
    "linear-algebra"
  ]
}
```

### 3. Realistic Complexity
Match complexity to actual token usage and difficulty.

```javascript
// Simple text operations
{ name: "Text Formatting", complexity: "low" }

// Complex architectural decisions
{ name: "System Design", complexity: "high" }
```

### 4. Tool Specification
List specific tools/libraries used.

```javascript
{
  name: "Frontend Development",
  tools: [
    "react",          // Framework
    "typescript",     // Language
    "tailwind",       // Styling
    "vite"           // Build tool
  ]
}
```

---

## 🎓 Skill Progression

### Learning Path Example

```javascript
const frontendPath = [
  // Level 1: Basics
  { skill: "html-css", complexity: "low" },
  { skill: "javascript-basics", complexity: "low" },

  // Level 2: Intermediate
  { skill: "react-basics", complexity: "medium", prerequisites: ["javascript-basics"] },
  { skill: "state-management", complexity: "medium", prerequisites: ["react-basics"] },

  // Level 3: Advanced
  { skill: "frontend-architecture", complexity: "high", prerequisites: ["react-basics", "state-management"] },
  { skill: "performance-optimization", complexity: "high", prerequisites: ["frontend-architecture"] }
];
```

### Skill Tree Visualization

```
JavaScript Basics
    ↓
    ├─→ React Basics
    │       ↓
    │       ├─→ State Management
    │       │       ↓
    │       │       └─→ Redux/Context
    │       │
    │       └─→ Component Patterns
    │               ↓
    │               └─→ Advanced Hooks
    │
    └─→ Node.js Basics
            ↓
            └─→ API Development
                    ↓
                    └─→ Full-Stack Development
```

---

## 📈 Skill Analytics

### Usage Metrics

```javascript
{
  skill: "data-analysis",
  stats: {
    timesUsed: 15420,
    avgTokens: 4800,
    avgDuration: "45 seconds",
    successRate: 97.5,
    avgCost: 0.014,
    usedByAgents: 24,
    mostCommonTasks: [
      "sales data analysis",
      "trend identification",
      "report generation"
    ]
  }
}
```

### Skill Recommendations

```javascript
// If user frequently uses "data-analysis"
// Recommend complementary skills:
recommendedSkills = [
  "data-visualization",
  "statistical-modeling",
  "report-generation"
];
```

---

## 🔗 Related Components

- **[Agents](./agents.md)**: AI specialists that possess skills
- **[Sub-Agents](./subagents.md)**: Task executors that use skills
- **[MCPs](./mcps.md)**: External integrations that enhance skills
- **[Commands](./commands.md)**: Actions that leverage skills

---

## 📋 Summary

### Skills Are:
- ✅ Capability definitions
- ✅ Reusable building blocks
- ✅ Stateless templates
- ✅ Composable and modular
- ✅ Searchable and discoverable

### Skills Enable:
- ✅ Agent capability matching
- ✅ Task complexity estimation
- ✅ Pricing transparency
- ✅ Learning path creation
- ✅ Skill-based recommendations

### Skills Work With:
- ✅ Agents (who possess them)
- ✅ Sub-agents (who use them)
- ✅ Tasks (which require them)
- ✅ MCPs (which enhance them)

---

**Need Help?**
- 📖 [Architecture Guide](../../subagents-vs-skills-architecture.md)
- 💬 [Community Discord](https://discord.gg/aitmpl)
- 🐛 [Report Issues](https://github.com/davila7/claude-code-templates/issues)

---

**Last Updated**: October 30, 2025
**Version**: 1.0
**Status**: Documentation Complete

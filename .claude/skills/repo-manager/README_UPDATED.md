# Claude Skills Worth Using

A curated collection of production-ready Claude skills, configurations, and best practices for effective AI-assisted workflows. From productivity and planning to development automation and M&A due diligence.

## 📁 Repository Structure

```
claude-skills-worth-using/
├── README.md                # This file
├── skills/                  # Claude skills and workflows (11 total)
│   ├── weekly-planner/         # ⏰ Energy-based weekly planning
│   ├── cc-session-manager/     # 📅 Claude Code session scheduler
│   ├── data-audit/            # 📊 Meta Ads account auditing
│   ├── posthog-wizard/        # 🎯 AI-First CLI patterns
│   ├── codebase-documenter/   # 📚 Comprehensive code documentation
│   ├── test-specialist/       # 🧪 Automated testing & TDD
│   ├── tech-debt-analyzer/    # 🔧 Technical debt assessment
│   ├── cicd-pipeline-generator/ # 🚀 CI/CD automation
│   ├── seo-optimizer/         # 🔍 SEO analysis & optimization
│   ├── startup-validator/     # ✅ M&A due diligence automation
│   └── pitch-deck/           # 🎯 Professional pitch generation
├── config/                  # Configuration files and preferences
│   └── user-preferences.md # Claude behavior configurations
├── examples/                # Example artifacts and outputs
│   └── artifacts/          # Sample generated artifacts
└── docs/                    # Additional documentation
```

## 🎯 Skills by Category

### ⏰ Productivity & Planning

Perfect for personal productivity, time management, and workflow optimization.

- **Weekly Planner** - Energy-based weekly planning system
- **CC Session Manager** - Claude Code session scheduler with token optimization

### 💻 Development Tools

Complete developer toolkit for documentation, testing, technical debt, and deployment.

- **Codebase Documenter** - Generate comprehensive code documentation
- **Test Specialist** - Automated testing and TDD implementation
- **Tech Debt Analyzer** - Technical debt assessment and prioritization
- **CI/CD Pipeline Generator** - Production-ready CI/CD configurations

### 💼 Business & M&A

Professional tools for due diligence, startup validation, and deal analysis.

- **Startup Validator** - M&A due diligence and investment scoring
- **Pitch Deck** - Professional presentation generation (M&A, fundraising, executive)
- **Data Audit** - Meta Ads account auditing and optimization

### 🔍 Content & Marketing

Tools for SEO optimization, content strategy, and marketing analysis.

- **SEO Optimizer** - Comprehensive SEO analysis and optimization

### 🧠 Knowledge & Patterns

Learn best practices and patterns from production AI tools.

- **PostHog Wizard** - AI-First CLI patterns and architecture

---

## 🌟 Featured Skills

### ⏰ Weekly Planner

**Sustainable productivity framework with energy-based scheduling**

A comprehensive weekly planning system that manages 2-3 weekly anchors, protects sacred morning practice, and leverages evening time for learning - all while preventing burnout.

**Key Features:**
- 🔴🟡🟢 Energy-based task scheduling (Drain/Neutral/Energize)
- 📊 2-3 weekly anchors with P0/P1/P2 priorities
- ⏰ Sacred morning practice protection (until 1pm)
- 🌙 Evening learning time (7pm-9pm, 1-2 hours)
- 📈 Friday Strategic Growth System reviews
- 🧠 Full memory integration for continuous improvement

**Activation:**
```
"Plan my week"
"I completed [task]"
"Weekly review"
```

**Tools Required:** Memory System, Conversation Search

[→ View Documentation](./skills/weekly-planner)

---

### 📅 CC Session Manager

**Intelligent Claude Code session scheduler with token optimization**

Automatically analyzes your calendar, parses conversation history, predicts token usage, and schedules optimal 5-hour Claude Code sessions - no questions asked.

**Key Features:**
- 📅 macOS Calendar (iCal) integration
- 📊 JSONL conversation file analysis
- 🎯 Token usage prediction
- 🤖 Automatic 5-hour session scheduling
- 📈 Visualization of usage patterns
- ⚡ Zero-configuration operation

**Activation:**
```
"Schedule my Claude Code sessions"
"Plan coding time"
```

**Tools Required:** Python 3.8+, macOS Calendar access

[→ View Documentation](./skills/cc-session-manager)

---

### 📚 Codebase Documenter

**Comprehensive code documentation generation**

Generate professional README files, architecture guides, API documentation, and inline comments following industry best practices.

**Key Features:**
- 📝 README templates with quick-start guides
- 🏗️ Architecture documentation patterns
- 🔌 API endpoint documentation
- 💬 Code comment best practices
- 📊 Progressive disclosure approach
- 🎨 Visual aids integration

**Activation:**
```
"Create documentation for this codebase"
"Generate README for this project"
"Document this API"
```

**Tools Required:** GitHub MCP (optional, for direct commits)

[→ View Documentation](./skills/codebase-documenter)

---

### 🧪 Test Specialist

**Automated testing strategy and TDD implementation**

Comprehensive test generation and testing strategy for modern development workflows.

**Key Features:**
- 🎯 Test-driven development workflows
- 📦 Unit, integration, and E2E testing patterns
- 🔧 Framework-agnostic (Jest, Pytest, Mocha, etc.)
- 📊 Coverage analysis guidance
- 🐛 Bug analysis methodology
- ✅ Best practices enforcement

**Activation:**
```
"Write tests for this function"
"Create test suite for this module"
"Implement TDD workflow"
```

**Tools Required:** None (framework-agnostic)

[→ View Documentation](./skills/test-specialist)

---

### 🔧 Tech Debt Analyzer

**Technical debt assessment and prioritization**

Automated codebase health assessment with actionable refactoring recommendations.

**Key Features:**
- 📊 Complexity scanning and metrics
- 📦 Dependency audit (outdated packages)
- 🔍 TODO/FIXME tracking
- 📈 Refactoring roadmaps
- 💰 Cost-benefit analysis
- 🎯 Priority scoring

**Activation:**
```
"Analyze technical debt in this codebase"
"Scan for code complexity issues"
"Create refactoring roadmap"
```

**Tools Required:** Python 3.8+, GitHub MCP (optional)

[→ View Documentation](./skills/tech-debt-analyzer)

---

### 🚀 CI/CD Pipeline Generator

**Production-ready CI/CD configurations**

Generate complete CI/CD pipelines for multiple platforms with security scanning and deployment strategies.

**Key Features:**
- 🔄 Multi-platform support (GitHub Actions, GitLab CI, CircleCI)
- 🐳 Docker integration
- 🔒 Security scanning (SAST, dependency checks)
- 🌍 Environment management (dev, staging, prod)
- 📦 Artifact management
- 🚀 Deployment strategies (blue-green, canary)

**Activation:**
```
"Create GitHub Actions workflow"
"Generate CI/CD pipeline for Python app"
"Set up deployment automation"
```

**Tools Required:** None (generates configuration files)

[→ View Documentation](./skills/cicd-pipeline-generator)

---

### ✅ Startup Validator

**M&A due diligence and investment scoring**

Comprehensive startup validation framework for acquisition targets and investment opportunities.

**Key Features:**
- 📊 Automated validation frameworks
- 🎯 Strategic fit analysis
- 📈 Investment scoring rubrics (0-100 scale)
- ✅ Due diligence checklists (financial, operational)
- 💰 Valuation analysis
- 📋 Board presentation generation

**Activation:**
```
"Validate this startup for acquisition: [details]"
"Score this company against M&A rubrics"
"Generate due diligence checklist"
```

**Tools Required:** Memory System (recommended)

[→ View Documentation](./skills/startup-validator)

---

### 🎯 Pitch Deck

**Professional presentation generation**

Generate compelling pitch decks for M&A acquisitions, startup fundraising, and executive presentations.

**Key Features:**
- 📊 M&A acquisition deck templates
- 🚀 Startup fundraising deck templates
- 📈 Executive summary templates
- 💰 Auto-populated financial visualizations
- 🎨 Professional design guidelines
- 📋 Board presentation standards

**Activation:**
```
"Generate M&A pitch deck for [company]"
"Create startup fundraising presentation"
"Build executive summary"
```

**Tools Required:** Memory System (recommended)

[→ View Documentation](./skills/pitch-deck)

---

### 📊 Data Audit

**Comprehensive Meta Ads account auditing**

Deep-dive audits of Meta advertising accounts with campaign performance, tracking infrastructure, and CAPI implementation analysis.

**Key Features:**
- 📊 Campaign and ad performance analysis
- 🔧 Tracking infrastructure assessment
- 🔄 CAPI (Conversions API) implementation guidance
- 📋 Automated report generation
- 🏗️ Architecture diagrams and recommendations
- 📈 ROI and optimization insights

**Activation:**
```
"Audit Meta account act_1234567890"
"Analyze campaign performance"
"Evaluate tracking infrastructure"
```

**Tools Required:** Pipeboard Meta MCP Server

[→ View Documentation](./skills/data-audit)

---

### 🔍 SEO Optimizer

**Comprehensive SEO analysis and optimization**

Professional SEO analysis for web content, technical SEO, and search optimization.

**Key Features:**
- 🎯 On-page SEO analysis
- 🔧 Technical SEO auditing
- 🏷️ Meta tag optimization
- 📊 Schema markup implementation
- 🗺️ Sitemap generation
- 📈 Keyword research and optimization

**Activation:**
```
"Analyze this page for SEO"
"Optimize meta tags for [content]"
"Generate schema markup"
```

**Tools Required:** Python 3.8+ (for advanced analysis)

[→ View Documentation](./skills/seo-optimizer)

---

### 🎯 PostHog Wizard

**AI-First CLI patterns from PostHog Wizard**

Learn and apply patterns from PostHog Wizard for building AI-first developer tools with deterministic LLM prompting.

**Key Features:**
- 🎯 Deterministic Prompting patterns (force structured JSON)
- 🔧 LLM Query Wrappers (centralized API calls)
- 📋 Agent Rules Generation (create `.cursor/rules` files)
- 🔌 MCP Server Management (programmatic installation)
- 📊 CLI Analytics integration
- 🏗️ AI-First Architecture patterns

**Activation:**
```
"PostHog Wizard patterns"
"CLI wizard architecture"
"Deterministic prompting examples"
```

**Tools Required:** None (knowledge-only skill)

[→ View Documentation](./skills/posthog-wizard)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Organized-AI/clalude-skills-worth-using.git
cd clalude-skills-worth-using
```

### 2. Choose Your Skills
Browse by category and select skills that match your workflow:

**For Productivity:**
```bash
cd skills/weekly-planner
```

**For Development:**
```bash
cd skills/codebase-documenter
cd skills/test-specialist
cd skills/tech-debt-analyzer
cd skills/cicd-pipeline-generator
```

**For Business/M&A:**
```bash
cd skills/startup-validator
cd skills/pitch-deck
cd skills/data-audit
```

### 3. Read Documentation
- `SKILL.md` - Core skill instructions
- `README.md` - Detailed usage guide
- Reference materials (in `/references` directory)

### 4. Use in Claude
- Copy skill to your Claude Project
- Use activation phrases
- Let the skill work automatically

## 📋 Requirements

### All Skills
- Claude Account (Sonnet 4.5 or newer recommended)
- Enable Claude Projects for memory management

### Specific Requirements

| Skill | Memory | Python | macOS | MCP Servers |
|-------|--------|--------|-------|-------------|
| Weekly Planner | ✅ Required | - | - | - |
| CC Session Manager | Recommended | ✅ 3.8+ | ✅ Calendar | - |
| Codebase Documenter | Recommended | - | - | GitHub (optional) |
| Test Specialist | - | - | - | - |
| Tech Debt Analyzer | Recommended | ✅ 3.8+ | - | GitHub (optional) |
| CI/CD Generator | - | - | - | - |
| Startup Validator | ✅ Recommended | - | - | - |
| Pitch Deck | ✅ Recommended | - | - | - |
| Data Audit | Recommended | - | - | ✅ Pipeboard Meta |
| SEO Optimizer | Recommended | ✅ 3.8+ | - | - |
| PostHog Wizard | - | - | - | - |

## 💡 Example Workflows

### Complete Developer Workflow
```
tech-debt-analyzer → Identify issues
      ↓
codebase-documenter → Document architecture
      ↓
test-specialist → Create comprehensive tests
      ↓
cicd-pipeline-generator → Automate deployment
```

### M&A Due Diligence Workflow
```
startup-validator → Validate acquisition target
      ↓
tech-debt-analyzer → Assess codebase health
      ↓
data-audit → Analyze marketing performance
      ↓
pitch-deck → Generate board presentation
```

### Content & SEO Workflow
```
seo-optimizer → Analyze and optimize content
      ↓
weekly-planner → Schedule content production
      ↓
data-audit → Track performance metrics
```

### Personal Productivity Setup
```
weekly-planner → Plan sustainable workweek
      ↓
cc-session-manager → Schedule coding sessions
      ↓
[Execute planned development work]
```

## 📊 Skills Comparison Matrix

| Skill | Category | Automation Level | Setup Time | Best For |
|-------|----------|------------------|------------|----------|
| Weekly Planner | Productivity | High | 5 min | Sustainable productivity |
| CC Session Manager | Productivity | Complete | 10 min | Code planning & budgeting |
| Codebase Documenter | Development | High | 2 min | Documentation generation |
| Test Specialist | Development | High | 2 min | Test generation & TDD |
| Tech Debt Analyzer | Development | Complete | 5 min | Code health assessment |
| CI/CD Generator | Development | Complete | 2 min | Deployment automation |
| Startup Validator | Business | High | 5 min | M&A due diligence |
| Pitch Deck | Business | High | 5 min | Professional presentations |
| Data Audit | Marketing | Complete | 2 min | Ad performance analysis |
| SEO Optimizer | Marketing | High | 2 min | SEO optimization |
| PostHog Wizard | Knowledge | N/A | 0 min | CLI development patterns |

## 🎓 Getting Started Guide

### New to Claude Skills?

**Start here:**
1. **Weekly Planner** - Easiest setup, immediate productivity value
2. **Codebase Documenter** - Quick wins for developer workflow
3. **PostHog Wizard** - Learn AI-first patterns (no setup required)

**Then add:**
- **Test Specialist** - If you write tests regularly
- **Data Audit** - If you manage Meta Ads campaigns
- **SEO Optimizer** - If you create web content

### Already Using Claude Skills?

**Power User Combos:**
- **Weekly Planner + CC Session Manager** = Complete workflow automation
- **Tech Debt Analyzer + Codebase Documenter + Test Specialist** = Code quality suite
- **Startup Validator + Pitch Deck + Data Audit** = M&A toolkit
- **SEO Optimizer + Weekly Planner** = Content production pipeline

### Building Your Own Skills?

**Learn from:**
1. **PostHog Wizard** - AI-first architecture patterns
2. **Weekly Planner** - Memory integration best practices
3. **CC Session Manager** - Calendar and file system integration
4. Review the modular skill architecture in [FINAL_ACTION_SUMMARY.md](./FINAL_ACTION_SUMMARY.md)

## 🤝 Contributing

This is an internal Organized AI repository. Contributions should follow these guidelines:

### Skill Guidelines
- ✅ Must include `SKILL.md` and `README.md`
- ✅ Clear activation phrases
- ✅ Comprehensive workflows
- ✅ Templates and examples
- ✅ Document all dependencies
- ✅ Test with real-world scenarios
- ✅ Follow "no questions asked" principle

### Skill Best Practices
- **Modular > Monolithic** - Small, focused skills (2-5KB)
- **Progressive Disclosure** - Load only what's needed
- **Single Responsibility** - Each skill does one thing well
- **Token Efficiency** - Optimize for context window usage
- **Composability** - Skills should work together naturally

## 📚 Documentation

Each skill includes comprehensive documentation:

| File/Directory | Purpose |
|----------------|---------|
| `SKILL.md` | Core skill logic and workflows |
| `README.md` | User guide and examples |
| `references/` | Templates, guides, and best practices |
| `examples/` | Sample outputs and use cases |
| `assets/` | Scripts, tools, and supporting files |

## 🎯 Use Cases by Role

### For Developers
- **Codebase Documenter** - Maintain documentation
- **Test Specialist** - Build comprehensive test suites
- **Tech Debt Analyzer** - Keep codebase healthy
- **CI/CD Generator** - Automate deployments
- **PostHog Wizard** - Learn AI-first patterns

### For Product Managers
- **Weekly Planner** - Manage priorities sustainably
- **Startup Validator** - Evaluate partnerships/acquisitions
- **Pitch Deck** - Create stakeholder presentations

### For Marketers
- **Data Audit** - Optimize ad campaigns
- **SEO Optimizer** - Improve search rankings
- **Weekly Planner** - Plan content calendars

### For Executives
- **Startup Validator** - Due diligence for M&A
- **Pitch Deck** - Board presentations
- **Data Audit** - Marketing ROI analysis

### For Founders
- **Pitch Deck** - Fundraising presentations
- **Weekly Planner** - Sustainable productivity
- **Tech Debt Analyzer** - Code quality monitoring

## 🔧 MCP Servers

Enhance skills with these MCP servers:

- **Memory** - Entity management and knowledge graphs (recommended for most skills)
- **Pipeboard Meta** - Meta Ads API integration (required for Data Audit)
- **GitHub** - Repository management (optional for development skills)
- **Sequential Thinking** - Enhanced reasoning workflows (recommended)
- **Google Workspace** - Sheets, Docs, Calendar integration

## 🎉 What's New

### Version 3.0.0 - November 2025

**Major Update: Complete Developer Toolkit**

- ✨ Added 7 new production-ready skills
- 🔧 Complete developer productivity suite (documenter, testing, CI/CD, tech debt)
- 💼 Professional M&A toolkit (validator, pitch deck)
- 🔍 Marketing suite (SEO optimizer, data audit)
- 📚 Enhanced documentation and examples
- 🏗️ Modular skill architecture (2-5KB per skill)
- 🎯 Category-based organization

**Skills Added:**
- Codebase Documenter
- Test Specialist
- Tech Debt Analyzer
- CI/CD Pipeline Generator
- Startup Validator
- Pitch Deck
- SEO Optimizer

**Attribution:**
6 skills adapted from [ailabs-393/ai-labs-claude-skills](https://github.com/ailabs-393/ai-labs-claude-skills) (MIT License)
See [AILABS_ATTRIBUTION.md](./skills/AILABS_ATTRIBUTION.md) for details.

## 🎭 Design Philosophy

These skills embody core principles:

1. **Automation Over Configuration** - Skills should "just work" with minimal setup
2. **Intelligence Over Options** - Make smart decisions instead of asking questions
3. **Memory Over Repetition** - Learn and improve with each use
4. **Modular Over Monolithic** - Small, focused skills that compose well
5. **Progressive Disclosure** - Load only what's needed when needed

The goal is to make AI assistance feel like working with an experienced colleague who knows you, your patterns, and your preferences.

## 📄 License

Internal use for Organized AI. Individual skills may have additional licenses:
- ailabs-393 skills: MIT License (see [AILABS_ATTRIBUTION.md](./skills/AILABS_ATTRIBUTION.md))

## 🔗 Links

- **Organization**: [Organized AI on GitHub](https://github.com/Organized-AI)
- **Website**: [organized.ai](https://organized.ai)
- **Source Attribution**: [ailabs-393/ai-labs-claude-skills](https://github.com/ailabs-393/ai-labs-claude-skills)

## 📞 Support

For questions, issues, or suggestions:
- Open an issue in this repository
- Contact the Organized AI team
- Review skill-specific documentation

---

**Last Updated:** November 20, 2025  
**Maintained By:** Organized AI Team  
**Version:** 3.0.0 (Now with 11 production-ready skills!)  
**Total Skills:** 11 (4 original + 7 new)

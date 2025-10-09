# Organized Codebase Template

> 🚀 **A comprehensive starter template for planning, architecting, and organizing your codebase before handing it off to AI coding agents like Claude Code.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Organized AI](https://img.shields.io/badge/Organized-AI-blue.svg)](https://organized.ai)

## 🎯 Purpose

This template bridges the gap between human planning and AI execution. It provides a structured approach to documenting your project requirements, architecture, and specifications so that coding agents can build exactly what you envision.

**Perfect for:**
- [Organized AI Live Events](https://lu.ma/organizedai-starterstacks) attendees
- Developers using Claude Code or similar AI coding agents
- Teams wanting better project documentation and handoff processes
- Anyone building software with AI assistance

## 🏁 Quick Start for First-Time Users

### Step 1: Clone & Create Your Project
```bash
# Clone the template repository
git clone https://github.com/Organized-AI/organized-codebase.git
cd organized-codebase

# Create your new project (interactive setup)
bash setup-template.sh "My Awesome Project"
```

This automatically:
- ✅ Creates project in parent directory
- ✅ Copies all templates & configurations
- ✅ Sets up DevContainer & Claude Agent SDK
- ✅ Includes Hybrid Agent System (GLM/OpenRouter/Agent Booster)
- ✅ Initializes git repository
- ✅ Provides 3 setup options (Manual, AI-powered, or DevContainer)

### Step 2: Set Up Token Tracking (Optional but Recommended)
```bash
# One-time setup for ALL your Claude projects
bash scripts/setup-cron.sh
```

This installs a system-wide tracker that:
- 📊 Monitors token usage hourly
- 💰 Helps manage Opus 4 budget
- 🔄 Works across all projects
- ⚡ Minimal overhead (~225ms/hour)

Check usage anytime:
```bash
cat ~/.claude/token-tracker.json | jq .
```

### Step 3: Follow the Interactive Setup

After running `setup-template.sh`, you'll see:

**Option A: AI-Powered Setup** (Fastest! 🚀)
1. Fill out `PLANNING/01-project-brief.md` with basic info
2. Set your API key: `export ANTHROPIC_API_KEY='your-key'`
3. Run: `npm install && npm run agent:setup`
4. Let Claude configure everything based on your brief!

**Option B: Manual Setup** (Traditional)
1. Fill out planning documents in order
2. Complete requirements and architecture
3. Define specifications and handoff instructions

**Option C: DevContainer Setup** (Isolated Environment)
1. Open in VS Code → "Reopen in Container"
2. Auto-configures Node 20, Python 3.11, Docker
3. Run the AI agent for automated setup

### Alternative: GitHub Template Method
If you prefer using GitHub's template feature:
1. Click **"Use this template"** button on GitHub
2. Name your repository
3. Clone locally and run `bash setup-template.sh`

## ⚡ Hybrid Agent System (New!)

This template now includes a powerful **Hybrid Agent System** that combines:
- **GLM/Z.ai** (primary) - 200K context, competitive pricing, specialized code models
- **OpenRouter** (fallback) - Access to Claude Opus 4.1, GPT-4, Gemini, and 100+ models
- **Agent Booster** - Ultra-fast local code editing (352x faster, $0 cost)

### Quick Start with Hybrid Agent

```bash
# 1. Install dependencies
npm install

# 2. Configure your API key (choose one)
echo "GLM_API_KEY=your_key_here" >> .env

# 3. Try it out!
npx hybrid-agent edit yourfile.js "Add TypeScript types"
```

### Key Features

✅ **352x faster** code editing (Agent Booster vs pure LLM)
✅ **80% cost reduction** (hybrid vs pure LLM approach)
✅ **Multi-provider support** (automatic failover)
✅ **Intelligent model selection** (task-based routing)
✅ **Standalone utilities** (ultra-fast transformations)

**See [HYBRID-AGENT-README.md](HYBRID-AGENT-README.md) for complete documentation.**

## 📁 Template Structure

```
organized-codebase/
├── 📋 PLANNING/
│   ├── 01-project-brief.md                    # Project vision and goals
│   ├── 02-requirements.md                     # Functional & non-functional requirements
│   ├── 03-architecture.md                     # System design and tech stack
│   ├── 04-user-stories.md                    # User stories and acceptance criteria
│   ├── 05-implementation-roadmap.md           # Development phases and timeline
│   ├── 07-token-tracking-implementation.md    # Token tracking system design
│   ├── 08-hybrid-agent-implementation.md      # Hybrid agent architecture
│   └── agent-booster-overview.md             # Agent Booster documentation
├── 🏗️ ARCHITECTURE/
│   ├── system-design.md                       # High-level system architecture
│   ├── data-models.md                        # Database schema and data structures
│   ├── api-specifications.md                 # API endpoints and contracts
│   └── tech-stack.md                        # Technology choices and rationale
├── 📖 DOCUMENTATION/
│   ├── README.md                             # Project overview and setup
│   ├── CONTRIBUTING.md                       # Contribution guidelines
│   ├── DEPLOYMENT.md                        # Deployment instructions
│   └── API_DOCS.md                          # API documentation
├── 🧪 SPECIFICATIONS/
│   ├── functional-specs.md                   # Detailed feature specifications
│   ├── technical-specs.md                    # Technical implementation details
│   ├── testing-strategy.md                   # Testing approach and requirements
│   └── acceptance-criteria.md                # Definition of done criteria
├── 🤖 AGENT-HANDOFF/
│   ├── coding-instructions.md                # Detailed instructions for AI agents
│   ├── file-structure.md                    # Expected project file organization
│   ├── dependencies.md                      # Required packages and services
│   └── completion-checklist.md              # Quality assurance checklist
├── 🎯 SUBAGENT-FRAMEWORK/
│   ├── agents/                              # Specialized agent implementations
│   │   ├── research/                        # Research agent
│   │   ├── implementation/                  # Implementation agent
│   │   └── orchestrator/                    # Orchestration agent
│   ├── commands/                            # Framework CLI commands
│   ├── templates/                           # Agent templates
│   ├── examples/                            # Example implementations
│   └── design-outputs/                      # Generated design artifacts
├── ⚙️ CONFIG/
│   ├── architecture-patterns.md             # Architecture best practices
│   ├── devcontainer-integration.md          # DevContainer setup guide
│   └── integration-guide.md                # Integration documentation
├── 🚀 src/
│   ├── providers/                           # LLM provider adapters
│   │   ├── LLMProvider.js                   # Base provider interface
│   │   ├── GLMAdapter.js                    # GLM/Z.ai integration (PRIMARY)
│   │   ├── OpenRouterAdapter.js             # OpenRouter integration (FALLBACK)
│   │   └── AnthropicAdapter.js              # Direct Anthropic API
│   ├── agents/                              # Hybrid agent system
│   │   └── HybridAgent.js                   # LLM + Agent Booster
│   ├── strategies/                          # Intelligent routing
│   │   └── ModelSelector.js                 # Task-based model selection
│   ├── cache/                               # Performance optimization
│   │   └── CodeCache.js                     # LLM response caching
│   ├── utils/                               # Standalone utilities
│   │   └── booster-utils.js                 # Agent Booster tools
│   └── cli/                                 # Command-line interface
│       └── hybrid-agent-cli.js              # Hybrid agent CLI
├── 🧪 tests/
│   └── benchmark.test.js                    # Performance benchmarks
├── 📦 PROJECT-FILES/
│   ├── package.json                         # Dependencies
│   ├── requirements.txt                     # Python dependencies (if applicable)
│   ├── docker-compose.yml                   # Container setup (if applicable)
│   └── .env.example                        # Environment variables template
├── 🔄 ITERATIONS/
│   ├── v1-mvp/                             # MVP version planning
│   ├── v2-enhancements/                    # Enhancement planning
│   └── v3-scaling/                         # Scaling considerations
├── 📜 scripts/
│   ├── setup-agent.js                      # AI-powered setup agent
│   ├── update-token-tracker.js             # Automated token tracking
│   └── setup-cron.sh                       # System-wide cron setup
├── 🐳 .devcontainer/
│   ├── devcontainer.json                   # DevContainer configuration
│   └── post-create.sh                      # Automated setup script
├── 📖 HYBRID-AGENT-README.md               # Hybrid agent usage guide
├── 🔧 setup-template.sh                    # Project template setup script
├── 📄 package.json                         # Main dependencies
└── 🚫 .gitignore                           # Git ignore rules (protects API keys)
```

## ✅ Getting Started Checklist

Follow this order for best results:

- [ ] **1. Run setup script**: `bash setup-template.sh "Project Name"`
- [ ] **2. Install token tracker**: `bash scripts/setup-cron.sh` (one-time)
- [ ] **3. Configure API keys**: Add to `.env` file
  - [ ] `ANTHROPIC_API_KEY` for Claude
  - [ ] `GLM_API_KEY` for GLM/Z.ai (optional)
  - [ ] `OPENROUTER_API_KEY` for 100+ models (optional)
- [ ] **4. Choose setup method**:
  - [ ] AI-powered (fastest) OR
  - [ ] Manual (traditional) OR
  - [ ] DevContainer (isolated)
- [ ] **5. Fill core planning doc**: `PLANNING/01-project-brief.md`
- [ ] **6. Run AI agent** (if using AI setup): `npm run agent:setup`
- [ ] **7. Review generated files**: Check all populated templates
- [ ] **8. Begin development**: Hand off to Claude Code

## 🚀 Detailed Workflow

### Phase 1: Initial Setup (5 minutes)
1. **Run setup script** to create project structure
2. **Set up token tracking** for budget management
3. **Configure API keys** in `.env` file

### Phase 2: Planning (10-30 minutes)
Using **AI-Powered Setup**:
- Fill basic project brief → AI generates rest
- Review and refine AI suggestions
- Total time: ~10 minutes

Using **Manual Setup**:
- Complete all planning documents
- Define requirements and architecture
- Total time: ~30+ minutes

### Phase 3: Development Handoff
1. **Open in Claude Code** or your AI coding assistant
2. **Point to documentation** folders
3. **AI reads specifications** and begins coding
4. **Iterate based on feedback**

## 📊 Token Usage Tracking

After setting up with `bash scripts/setup-cron.sh`, you get:

### Real-Time Usage Monitoring
```bash
# View current usage
cat ~/.claude/token-tracker.json | jq .

# Manual update
node scripts/update-token-tracker.js
```

### Output Format
```json
{
  "weekly": {
    "total": 79853,
    "byModel": {
      "claude-opus-4-20250514": 12500,
      "claude-sonnet-4-5-20250929": 67353
    }
  },
  "daily": {
    "total": 33510,
    "byModel": {
      "claude-sonnet-4-5-20250929": 33510
    }
  },
  "fiveHourWindow": {
    "limit": 200000,
    "remaining": 185000,
    "resetTime": "2025-10-07T18:00:00.000Z"
  }
}
```

### Budget Optimization Strategy
**Save 80% on planning costs:**
- Use **Sonnet 4.5** for drafting (30-50k tokens @ $0.15-0.20)
- Use **Opus 4** for critical reviews (10-20k tokens @ $0.15-0.25)
- Total: $0.30-0.45 vs $1-2 with all-Opus

## 💡 Best Practices

### For Better AI Results:
- **Be specific**: Detailed requirements lead to better code
- **Include examples**: Show what you mean with concrete examples
- **Define edge cases**: Explain how to handle errors and unusual scenarios
- **Set quality standards**: Be clear about code style, testing, and documentation expectations

### For Better Project Outcomes:
- **Start small**: Focus on MVP first, then iterate
- **Document decisions**: Record the "why" behind your choices
- **Plan for maintenance**: Consider long-term maintenance and updates
- **Think about users**: Keep user experience at the center

## 🛠️ Customization

This template is designed to be flexible. You can:
- **Remove sections** you don't need
- **Add custom templates** for your specific domain
- **Modify the structure** to match your workflow
- **Create variants** for different project types

## 📚 Examples

Check out these example implementations:
- **Web App Example**: [Coming Soon]
- **API Service Example**: [Coming Soon]
- **Mobile App Example**: [Coming Soon]
- **Data Pipeline Example**: [Coming Soon]

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Share your experience**: Open an issue to discuss improvements
2. **Submit templates**: Add domain-specific templates via PR
3. **Fix bugs**: Found an error? Submit a fix
4. **Improve docs**: Help make the documentation clearer

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📖 Resources

### Organized AI
- **Live Events Calendar**: [https://lu.ma/organizedai-starterstacks](https://luma.com/organizedai-vip)
- **Community**: [https://lu.ma/Organizedai](https://lu.ma/Organizedai)
- **Website**: [https://organized.ai](https://organized.ai)

### AI Coding Tools
- **Claude Code**: Anthropic's agentic coding tool
- **GitHub Copilot**: AI pair programmer
- **Cursor**: AI-powered code editor

### Related Templates
- **Project Planning**: [Coming Soon]
- **API Documentation**: [Coming Soon]
- **Testing Strategy**: [Coming Soon]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Organized AI community
- Built for developers using AI coding agents
- Designed based on real-world project handoff experiences

---

**Ready to organize your next project?** Start with `PLANNING/01-project-brief.md` and work your way through the template. Your future self (and your AI coding agent) will thank you!

For questions or support, reach out to the [Organized AI community](https://lu.ma/Organizedai).

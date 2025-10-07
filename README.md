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

## 🏁 Quick Start

### Option 1: Use Setup Script (Recommended)
```bash
# Clone the template
git clone https://github.com/Organized-AI/organized-codebase.git
cd organized-codebase

# Create a new project
bash setup-template.sh "My New Project"
```

This creates a complete project with:
- ✅ DevContainer configuration
- ✅ Claude Agent SDK integration
- ✅ Token tracking scripts
- ✅ All planning templates
- ✅ Git repository initialized

### Option 2: Use GitHub Template
1. Click **"Use this template"** button above
2. Name your new project repository
3. Clone your new repository locally
4. Start filling out the planning documents

### Option 3: Manual Setup
```bash
git clone https://github.com/Organized-AI/organized-codebase.git your-project-name
cd your-project-name
rm -rf .git  # Remove git history
git init     # Start fresh
```

## 📁 Template Structure

```
your-project-name/
├── 📋 PLANNING/
│   ├── 01-project-brief.md           # Project vision and goals
│   ├── 02-requirements.md            # Functional & non-functional requirements
│   ├── 03-architecture.md            # System design and tech stack
│   ├── 04-user-stories.md           # User stories and acceptance criteria
│   └── 05-implementation-roadmap.md  # Development phases and timeline
├── 🏗️ ARCHITECTURE/
│   ├── system-design.md              # High-level system architecture
│   ├── data-models.md               # Database schema and data structures
│   ├── api-specifications.md        # API endpoints and contracts
│   └── tech-stack.md               # Technology choices and rationale
├── 📖 DOCUMENTATION/
│   ├── README.md                    # Project overview and setup
│   ├── CONTRIBUTING.md              # Contribution guidelines
│   ├── DEPLOYMENT.md               # Deployment instructions
│   └── API_DOCS.md                 # API documentation
├── 🧪 SPECIFICATIONS/
│   ├── functional-specs.md          # Detailed feature specifications
│   ├── technical-specs.md           # Technical implementation details
│   ├── testing-strategy.md          # Testing approach and requirements
│   └── acceptance-criteria.md       # Definition of done criteria
├── 🤖 AGENT-HANDOFF/
│   ├── coding-instructions.md       # Detailed instructions for AI agents
│   ├── file-structure.md           # Expected project file organization
│   ├── dependencies.md             # Required packages and services
│   └── completion-checklist.md     # Quality assurance checklist
├── 📦 PROJECT-FILES/
│   ├── package.json                # Dependencies (if applicable)
│   ├── requirements.txt            # Python dependencies (if applicable)
│   ├── docker-compose.yml          # Container setup (if applicable)
│   └── .env.example               # Environment variables template
└── 🔄 ITERATIONS/
    ├── v1-mvp/                     # MVP version planning
    ├── v2-enhancements/            # Enhancement planning
    └── v3-scaling/                 # Scaling considerations
```

## 🚀 How to Use This Template

### Step 1: Project Planning (Human)
1. **Start with the vision**: Fill out `PLANNING/01-project-brief.md`
2. **Define requirements**: Complete `PLANNING/02-requirements.md`
3. **Design architecture**: Document in `PLANNING/03-architecture.md`
4. **Write user stories**: Create stories in `PLANNING/04-user-stories.md`
5. **Plan implementation**: Outline phases in `PLANNING/05-implementation-roadmap.md`

### Step 2: Detailed Specifications (Human)
1. **System design**: Detail your architecture in `ARCHITECTURE/`
2. **Technical specs**: Define implementation details in `SPECIFICATIONS/`
3. **Documentation**: Set up project docs in `DOCUMENTATION/`

### Step 3: Agent Preparation (Human)
1. **Coding instructions**: Create clear instructions in `AGENT-HANDOFF/coding-instructions.md`
2. **File structure**: Define expected structure in `AGENT-HANDOFF/file-structure.md`
3. **Dependencies**: List all requirements in `AGENT-HANDOFF/dependencies.md`
4. **Completion criteria**: Set quality standards in `AGENT-HANDOFF/completion-checklist.md`

### Step 4: Handoff to AI Agent (AI)
1. Provide the completed documentation to Claude Code or similar AI agent
2. The agent uses the specifications to build your project
3. Review against the completion checklist
4. Iterate and refine as needed

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

## 📊 Automated Token Tracking (Optional)

Track your Claude Code token usage across all projects with automated hourly updates.

### One-Time Setup (Recommended)

```bash
# From any project created with setup-template.sh
bash scripts/setup-cron.sh
```

This installs a **system-wide** cron job that:
- ✅ Runs hourly (minimal overhead: ~225ms)
- ✅ Tracks Opus 4, Sonnet 4, Haiku 4 usage
- ✅ Updates `~/.claude/token-tracker.json`
- ✅ Works across **ALL** your Claude Code projects
- ✅ Only needs to be run **ONCE** per system

### View Your Usage

```bash
# Check current token usage
cat ~/.claude/token-tracker.json | jq .

# Manual update (optional)
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
    },
    "limits": {}
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

**Note:** Models are tracked dynamically by their full ID (e.g., `claude-opus-4-20250514`) and sorted by usage (most used first).

**For iCal integration:** The token tracker provides real-time budget data for scheduling Opus 4 sessions strategically.

See [scripts/README.md](scripts/README.md) for detailed documentation.

## 📖 Resources

### Organized AI
- **Live Events**: [https://lu.ma/organizedai-starterstacks](https://lu.ma/organizedai-starterstacks)
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

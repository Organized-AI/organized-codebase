# Hybrid Agent System - Quick Start Guide

## Overview

The Hybrid Agent System combines:
- **GLM/Z.ai** (primary) - 200K context, competitive pricing, specialized code models
- **OpenRouter** (fallback) - Access to Claude Opus 4.1, GPT-4, Gemini, and 100+ models
- **Anthropic Direct** (optional) - Direct Claude API access
- **Agent Booster** - Ultra-fast local code editing (352x faster, $0 cost)

## Installation

```bash
# Install dependencies
npm install

# Or install globally
npm install -g .
```

## Quick Setup

### 1. Get API Keys

**Primary: GLM/Z.ai (Recommended)**
- Visit: https://open.bigmodel.cn/
- Sign up and get your API key
- Models: GLM-4, GLM-4-Flash, CodeGeeX-4

**Fallback: OpenRouter (Optional)**
- Visit: https://openrouter.ai/keys
- Get API key for access to 100+ models
- Includes Claude Opus 4.1, GPT-4, Gemini

**Direct: Anthropic (Optional)**
- Visit: https://console.anthropic.com/settings/keys
- Get API key for direct Claude access

### 2. Configure Environment

Create `.env` file (copy from `.env.example`):

```bash
# Primary Provider (GLM/Z.ai)
GLM_API_KEY=your_glm_api_key_here

# Fallback Provider (OpenRouter) - Optional
OPENROUTER_API_KEY=your_openrouter_key_here

# Direct Provider (Anthropic) - Optional
ANTHROPIC_API_KEY=your_anthropic_key_here

# Provider Selection
DEFAULT_LLM_PROVIDER=auto  # auto|glm|openrouter|anthropic

# Default Models
DEFAULT_GLM_MODEL=glm-4
DEFAULT_OPENROUTER_MODEL=anthropic/claude-opus-4-1-20250805
DEFAULT_ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Agent Booster Settings
BOOSTER_CONFIDENCE_THRESHOLD=0.7
BOOSTER_MAX_CHUNKS=100
```

## Usage

### CLI Commands

#### 1. Edit a Single File
```bash
# Using hybrid agent (LLM + Booster)
hybrid-agent edit src/example.js "Add TypeScript types"

# Specify provider
hybrid-agent edit src/example.js "Add error handling" --provider glm

# Dry run (preview changes)
hybrid-agent edit src/example.js "Modernize syntax" --dry-run
```

#### 2. Analyze Code
```bash
hybrid-agent analyze src/complex.js "What are the performance bottlenecks?"

# Use specific model
hybrid-agent analyze src/app.js "Suggest improvements" --model codegeex-4
```

#### 3. Multi-Step Refactoring
```bash
hybrid-agent refactor src/legacy.js "Modernize to ES6+ and add types" --max-steps 5
```

#### 4. Batch Edit Multiple Files
```bash
hybrid-agent batch "src/**/*.js" "Add JSDoc comments"

# Dry run
hybrid-agent batch "src/**/*.ts" "Add error handling" --dry-run
```

#### 5. Agent Booster Only (Ultra-Fast, No LLM)
```bash
# Fast transformation (no API cost)
hybrid-agent booster-transform "src/**/*.js" "modernized code here"

# Add TypeScript types
hybrid-agent booster-typescript "src/**/*.js"

# Modernize syntax
hybrid-agent booster-modernize "src/**/*.js"
```

#### 6. View Available Models
```bash
# List models for a provider
hybrid-agent models --provider glm

# Get model recommendations for a task
hybrid-agent models --task code-generation
```

#### 7. View Statistics
```bash
hybrid-agent stats --provider glm
```

### Programmatic Usage

```javascript
const { HybridAgent } = require('./src/agents/HybridAgent');
const { BoosterUtils } = require('./src/utils/booster-utils');

// 1. Hybrid Agent (LLM + Booster)
async function hybridExample() {
  const agent = new HybridAgent({
    provider: 'glm', // or 'auto', 'openrouter', 'anthropic'
    defaultModel: 'glm-4'
  });

  // Edit code
  const result = await agent.editCode(
    'function hello() { console.log("world"); }',
    'Add TypeScript types and async/await',
    'typescript'
  );

  console.log(result.output);
  console.log(`Confidence: ${result.confidence}`);
  console.log(`LLM: ${result.latency.llm}ms, Booster: ${result.latency.booster}ms`);
  console.log(`Speedup: ${result.latency.llm / result.latency.booster}x`);
}

// 2. Booster Only (Ultra-Fast)
async function boosterExample() {
  const booster = new BoosterUtils();

  // Transform multiple files
  const results = await booster.transformFiles(
    'src/**/*.js',
    'modernized code here',
    { dryRun: false }
  );

  console.log(`Successful: ${results.successful}/${results.total}`);
}

// 3. Batch Edit
async function batchExample() {
  const agent = new HybridAgent();

  const files = [
    { path: 'file1.js', code: 'code...', language: 'javascript' },
    { path: 'file2.ts', code: 'code...', language: 'typescript' }
  ];

  const result = await agent.batchEdit(files, 'Add error handling');
  console.log(`Success: ${result.summary.successful}/${result.summary.total}`);
}
```

## Architecture

```
┌─────────────────────────────────────────────┐
│         Hybrid Agent System                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────────────────────────────┐   │
│  │  LLM Layer (Multi-Provider)        │   │
│  │  • GLM (Primary)                   │   │
│  │  • OpenRouter (Fallback)           │   │
│  │  • Anthropic (Direct)              │   │
│  │                                     │   │
│  │  Tasks:                             │   │
│  │  - Planning & reasoning             │   │
│  │  - Code analysis                    │   │
│  │  - Generate transformations         │   │
│  └────────────────────────────────────┘   │
│                  ↓                          │
│  ┌────────────────────────────────────┐   │
│  │  Agent Booster (Local)             │   │
│  │  • Ultra-fast code edits           │   │
│  │  • 100% local, $0 cost             │   │
│  │  • 0-13ms latency                  │   │
│  │  • 352x speedup                    │   │
│  └────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

## Performance Benchmarks

Run benchmarks:
```bash
npm test
# or
npm run benchmark
```

Expected Results:
- **LLM Latency**: 500-3000ms (varies by provider/model)
- **Booster Latency**: 0-13ms (local processing)
- **Speedup**: 50-350x for code edits
- **Cost**: ~$0.000001-0.0001 per edit (LLM) + $0 (Booster)

## Model Recommendations

### Code Analysis
- **GLM**: `glm-4` (200K context, advanced reasoning)
- **OpenRouter**: `anthropic/claude-opus-4-1-20250805`
- **Anthropic**: `claude-opus-4-20250514`

### Code Generation
- **GLM**: `codegeex-4` (specialized for code)
- **OpenRouter**: `anthropic/claude-sonnet-4`
- **Anthropic**: `claude-3-5-sonnet-20241022`

### Fast Operations
- **GLM**: `glm-4-flash`
- **OpenRouter**: `google/gemini-2.5-flash`
- **Anthropic**: `claude-3-5-haiku-20241022`

## File Structure

```
organized-codebase/
├── src/
│   ├── providers/          # LLM provider adapters
│   │   ├── LLMProvider.js        # Base provider class
│   │   ├── GLMAdapter.js         # GLM/Z.ai integration
│   │   ├── OpenRouterAdapter.js  # OpenRouter integration
│   │   └── AnthropicAdapter.js   # Anthropic direct integration
│   ├── agents/             # Hybrid agent system
│   │   └── HybridAgent.js        # Main hybrid agent class
│   ├── strategies/         # Smart model selection
│   │   └── ModelSelector.js      # Task-based model selection
│   ├── cache/              # Caching layer
│   │   └── CodeCache.js          # LLM response caching
│   ├── utils/              # Standalone utilities
│   │   └── booster-utils.js      # Agent Booster utilities
│   └── cli/                # Command-line interface
│       └── hybrid-agent-cli.js   # CLI tool
├── tests/
│   └── benchmark.test.js   # Performance benchmarks
├── .env.example            # Environment template
├── package.json
└── PLANNING/
    └── 08-hybrid-agent-implementation.md
```

## Cost Comparison

### Scenario: 100 Code Edits

| Approach | LLM Cost | Edit Cost | Total | Time |
|----------|----------|-----------|-------|------|
| **Pure LLM** | $5.00 | $5.00 | $10.00 | ~6 min |
| **Hybrid (GLM + Booster)** | $2.00 | $0.00 | $2.00 | ~1 min |
| **Savings** | - | - | **80%** | **83%** |

## Troubleshooting

**No LLM provider configured**
- Add at least one API key to `.env`: `GLM_API_KEY`, `OPENROUTER_API_KEY`, or `ANTHROPIC_API_KEY`

**Rate limit exceeded**
- Switch providers using `--provider` flag
- Use caching to reduce API calls

**Low confidence edits**
- Adjust `BOOSTER_CONFIDENCE_THRESHOLD` in `.env`
- Try different LLM models with `--model` flag

**Agent Booster not working**
- Ensure `agent-booster` is installed: `npm install agent-booster`
- Check file language detection is correct

## Next Steps

1. **Get Started**: Add your GLM API key to `.env`
2. **Test It**: Run `npm test` to see benchmarks
3. **Try CLI**: Use `hybrid-agent edit` on a sample file
4. **Integrate**: Use the HybridAgent class in your projects
5. **Optimize**: Review stats with `hybrid-agent stats`

## Resources

- **GLM/Z.ai API**: https://open.bigmodel.cn/dev/api
- **OpenRouter**: https://openrouter.ai/docs
- **Agent Booster**: https://www.npmjs.com/package/agent-booster
- **Planning Doc**: [PLANNING/08-hybrid-agent-implementation.md](PLANNING/08-hybrid-agent-implementation.md)

---

**Built with:**
- GLM-4 for intelligent planning
- Agent Booster for lightning-fast execution
- OpenRouter for model flexibility
- 100% open source & extensible

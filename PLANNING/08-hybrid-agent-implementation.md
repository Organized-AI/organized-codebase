# Hybrid Agent Implementation Plan
## GLM/Z.ai + Agent Booster Architecture (with OpenRouter Fallback)

---

## Overview

This document outlines the implementation plan for a hybrid AI agent system that combines:
- **GLM/Z.ai API** as primary LLM provider for reasoning, planning, and code analysis (GLM-4, CodeGeeX models)
- **OpenRouter API** as secondary/fallback provider for additional model flexibility (Claude Opus 4.1, GPT-4, Gemini)
- **Agent Booster** for ultra-fast code editing and transformations (352x faster, $0 cost)

### Key Benefits
- 🚀 **352x faster** code editing operations
- 💰 **Massive cost savings** ($0 for code edits vs $0.01+ per LLM edit)
- 🔄 **Multi-provider flexibility** (GLM-4 primary, Claude/GPT-4/Gemini via OpenRouter fallback)
- 🔐 **Privacy-first** code editing (local processing)
- ⚡ **Sub-millisecond latency** for code transformations
- 🌏 **GLM-4 advantages**: 200K context window, specialized code models, competitive pricing

---

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Hybrid Agent System                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  LLM Layer (Multi-Provider)                        │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │  PRIMARY: GLM/Z.ai API                             │  │
│  │  • GLM-4 (200K context, advanced reasoning)        │  │
│  │  • GLM-4-Flash (fast, efficient)                   │  │
│  │  • CodeGeeX-4 (specialized for code)               │  │
│  │                                                      │  │
│  │  FALLBACK: OpenRouter API                          │  │
│  │  • Claude Opus 4.1 (most capable)                  │  │
│  │  • GPT-4o, Gemini 2.5, Llama 3.1                  │  │
│  │                                                      │  │
│  │  Tasks:                                             │  │
│  │  • Task planning & orchestration                    │  │
│  │  • Code analysis & understanding                    │  │
│  │  • Decision making & reasoning                      │  │
│  │  • Generate code suggestions                        │  │
│  │  • Natural language processing                      │  │
│  │                                                      │  │
│  │  Cost: GLM (competitive) / OpenRouter (varied)     │  │
│  │  Speed: 0.5-3 seconds per request                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                            ↓                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Code Editing Layer (Agent Booster - Local)        │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │  • Apply code edits (sub-millisecond)               │  │
│  │  • Code transformations & refactoring               │  │
│  │  • Multi-file batch editing                         │  │
│  │  • Template-based optimizations                     │  │
│  │  • Syntax validation                                │  │
│  │                                                      │  │
│  │  Processing: 100% local (Rust + WASM)              │  │
│  │  Cost: $0 (no API calls)                           │  │
│  │  Speed: 0-13ms per edit                            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Core Integration (Week 1)

#### 1.1 Setup Dependencies
```bash
# Install required packages
npm install agent-booster axios openai dotenv
```

#### 1.2 Create Hybrid Agent Class
**File**: `src/agents/HybridAgent.js`

```javascript
const { AgentBooster } = require('agent-booster');
const { GLMAdapter } = require('../providers/GLMAdapter');
const { OpenRouterAdapter } = require('../providers/OpenRouterAdapter');
require('dotenv').config();

class HybridAgent {
  constructor(config = {}) {
    // Determine which provider to use
    const provider = config.provider || process.env.DEFAULT_LLM_PROVIDER || 'auto';

    // Initialize LLM provider
    if (provider === 'glm' || (provider === 'auto' && process.env.GLM_API_KEY)) {
      // Use GLM as primary provider
      this.llm = new GLMAdapter({
        apiKey: process.env.GLM_API_KEY,
        defaultModel: config.defaultModel || process.env.DEFAULT_GLM_MODEL || 'glm-4'
      });
      this.provider = 'glm';
    } else if (provider === 'openrouter' || (provider === 'auto' && process.env.OPENROUTER_API_KEY)) {
      // Use OpenRouter as fallback
      this.llm = new OpenRouterAdapter({
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultModel: config.defaultModel || process.env.DEFAULT_OPENROUTER_MODEL || 'anthropic/claude-opus-4-1-20250805',
        appName: config.appName || process.env.APP_NAME || 'Hybrid Agent System',
        siteUrl: config.siteUrl || process.env.APP_URL || 'http://localhost:3000'
      });
      this.provider = 'openrouter';
    } else {
      throw new Error('No LLM provider configured. Set GLM_API_KEY or OPENROUTER_API_KEY in .env');
    }

    // Agent Booster for code editing
    this.booster = new AgentBooster({
      confidenceThreshold: config.confidenceThreshold || 0.7,
      maxChunks: config.maxChunks || 100
    });

    // Default model selection
    this.defaultModel = this.llm.defaultModel;

    // Usage tracking
    this.stats = {
      llmCalls: 0,
      llmTokens: 0,
      boosterEdits: 0,
      totalLatency: { llm: 0, booster: 0 }
    };
  }

  async analyzeCode(code, question, options = {}) {
    const startTime = Date.now();

    const response = await this.llm.chat({
      model: options.model || this.defaultModel,
      messages: [{
        role: 'user',
        content: `${question}\n\nCode:\n\`\`\`\n${code}\n\`\`\``
      }],
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 2000
    });

    const latency = Date.now() - startTime;

    // Track usage
    this.stats.llmCalls++;
    this.stats.llmTokens += response.usage.total_tokens;
    this.stats.totalLatency.llm += latency;

    return {
      analysis: response.content,
      usage: response.usage,
      latency,
      model: response.model,
      provider: this.provider
    };
  }

  async editCode(code, instruction, language = 'typescript', options = {}) {
    // Step 1: LLM generates the edit suggestion
    const analysisStart = Date.now();

    const response = await this.llm.chat({
      model: options.model || this.defaultModel,
      messages: [{
        role: 'user',
        content: `Apply this change: ${instruction}\n\nOriginal code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide only the modified code, no explanations.`
      }],
      temperature: 0.3 // Lower temp for code generation
    });

    const llmLatency = Date.now() - analysisStart;

    // Extract code from response (handle markdown code blocks)
    let suggestedCode = response.content;
    const codeBlockMatch = suggestedCode.match(/```[\w]*\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      suggestedCode = codeBlockMatch[1];
    }

    // Step 2: Agent Booster applies the edit (ultra-fast!)
    const editStart = Date.now();

    const result = await this.booster.apply({
      code: code,
      edit: suggestedCode,
      language: language
    });

    const boosterLatency = Date.now() - editStart;

    // Track usage
    this.stats.llmCalls++;
    this.stats.llmTokens += response.usage.total_tokens;
    this.stats.boosterEdits++;
    this.stats.totalLatency.llm += llmLatency;
    this.stats.totalLatency.booster += boosterLatency;

    return {
      output: result.output,
      success: result.success,
      confidence: result.confidence,
      strategy: result.strategy,
      latency: {
        llm: llmLatency,
        booster: boosterLatency,
        total: llmLatency + boosterLatency
      },
      usage: response.usage,
      suggestedCode // For debugging
    };
  }

  async batchEdit(files, instruction, options = {}) {
    // Step 1: LLM analyzes the batch operation
    const fileList = files.map(f => `${f.path}: ${f.language}`).join('\n');

    const planResponse = await this.llm.chat.completions.create({
      model: options.model || this.defaultModel,
      messages: [{
        role: 'user',
        content: `Plan how to apply this change across multiple files: ${instruction}\n\nFiles:\n${fileList}\n\nProvide a structured plan.`
      }]
    });

    // Step 2: Agent Booster applies edits in parallel
    const results = await Promise.all(
      files.map(async (file) => {
        // Generate edit suggestion for each file
        const editResponse = await this.llm.chat.completions.create({
          model: options.model || this.defaultModel,
          messages: [{
            role: 'user',
            content: `Apply: ${instruction}\n\nFile: ${file.path}\nCode:\n\`\`\`${file.language}\n${file.code}\n\`\`\``
          }],
          temperature: 0.3
        });

        let suggestedCode = editResponse.choices[0].message.content;
        const match = suggestedCode.match(/```[\w]*\n([\s\S]*?)\n```/);
        if (match) suggestedCode = match[1];

        // Apply with Agent Booster
        const result = await this.booster.apply({
          code: file.code,
          edit: suggestedCode,
          language: file.language
        });

        return {
          path: file.path,
          ...result
        };
      })
    );

    return {
      plan: planResponse.choices[0].message.content,
      results,
      summary: {
        total: files.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };
  }

  async refactor(code, refactoringGoal, language = 'typescript', options = {}) {
    // Multi-step refactoring with LLM planning + Agent Booster execution

    // Step 1: LLM creates refactoring plan
    const planResponse = await this.llm.chat.completions.create({
      model: options.model || this.defaultModel,
      messages: [{
        role: 'user',
        content: `Create a step-by-step refactoring plan for: ${refactoringGoal}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide numbered steps.`
      }]
    });

    const plan = planResponse.choices[0].message.content;

    // Step 2: Execute each refactoring step
    let currentCode = code;
    const steps = [];

    // Parse steps from LLM response (simple parsing, can be improved)
    const stepMatches = plan.match(/\d+\.\s*(.+)/g) || [];

    for (const stepDescription of stepMatches.slice(0, options.maxSteps || 5)) {
      const stepResult = await this.editCode(
        currentCode,
        stepDescription,
        language,
        options
      );

      if (stepResult.success && stepResult.confidence > 0.6) {
        currentCode = stepResult.output;
        steps.push({
          description: stepDescription,
          success: true,
          confidence: stepResult.confidence
        });
      } else {
        steps.push({
          description: stepDescription,
          success: false,
          reason: 'Low confidence or failed'
        });
        break;
      }
    }

    return {
      plan,
      finalCode: currentCode,
      steps,
      successful: steps.every(s => s.success)
    };
  }

  getStats() {
    return {
      ...this.stats,
      avgLatency: {
        llm: this.stats.llmCalls > 0 ? this.stats.totalLatency.llm / this.stats.llmCalls : 0,
        booster: this.stats.boosterEdits > 0 ? this.stats.totalLatency.booster / this.stats.boosterEdits : 0
      },
      speedup: this.stats.llmCalls > 0 && this.stats.boosterEdits > 0
        ? (this.stats.totalLatency.llm / this.stats.llmCalls) / (this.stats.totalLatency.booster / this.stats.boosterEdits)
        : 0
    };
  }

  resetStats() {
    this.stats = {
      llmCalls: 0,
      llmTokens: 0,
      boosterEdits: 0,
      totalLatency: { llm: 0, booster: 0 }
    };
  }
}

module.exports = { HybridAgent };
```

#### 1.3 Environment Configuration
**File**: `.env`

```bash
# Primary LLM Provider: GLM/Z.ai
GLM_API_KEY=your_glm_api_key_here

# Fallback LLM Provider: OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Provider Selection (glm, openrouter, or auto)
DEFAULT_LLM_PROVIDER=auto

# Default Models
DEFAULT_GLM_MODEL=glm-4
DEFAULT_OPENROUTER_MODEL=anthropic/claude-opus-4-1-20250805

# Optional: Agent Booster settings
BOOSTER_CONFIDENCE_THRESHOLD=0.7
BOOSTER_MAX_CHUNKS=100

# Optional: App metadata
APP_NAME=Hybrid Agent System
APP_URL=http://localhost:3000
```

---

### Phase 2: CLI Tool (Week 1-2)

#### 2.1 Create CLI Interface
**File**: `src/cli/hybrid-agent-cli.js`

```javascript
#!/usr/bin/env node

const { Command } = require('commander');
const { HybridAgent } = require('../agents/HybridAgent');
const fs = require('fs').promises;
const path = require('path');

const program = new Command();

program
  .name('hybrid-agent')
  .description('Hybrid AI Agent CLI - GLM/OpenRouter + Agent Booster')
  .version('1.0.0');

program
  .command('edit')
  .description('Edit a code file with AI assistance')
  .argument('<file>', 'File to edit')
  .argument('<instruction>', 'What to change')
  .option('-m, --model <model>', 'LLM model to use')
  .option('-p, --provider <provider>', 'LLM provider (glm/openrouter/auto)', 'auto')
  .option('-l, --language <lang>', 'Programming language', 'typescript')
  .option('-o, --output <file>', 'Output file (default: overwrite input)')
  .action(async (file, instruction, options) => {
    try {
      const agent = new HybridAgent({
        defaultModel: options.model,
        provider: options.provider
      });
      const code = await fs.readFile(file, 'utf-8');

      console.log(`📝 Editing ${file}...`);

      const result = await agent.editCode(code, instruction, options.language);

      if (result.success) {
        const outputFile = options.output || file;
        await fs.writeFile(outputFile, result.output);

        console.log(`✅ Success! Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`⚡ Latency: LLM ${result.latency.llm}ms, Booster ${result.latency.booster}ms`);
        console.log(`💾 Saved to: ${outputFile}`);
      } else {
        console.error('❌ Edit failed');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('analyze')
  .description('Analyze code with AI')
  .argument('<file>', 'File to analyze')
  .argument('<question>', 'Question about the code')
  .option('-m, --model <model>', 'LLM model to use')
  .action(async (file, question, options) => {
    try {
      const agent = new HybridAgent({ defaultModel: options.model });
      const code = await fs.readFile(file, 'utf-8');

      console.log(`🔍 Analyzing ${file}...`);

      const result = await agent.analyzeCode(code, question, options);

      console.log('\n📊 Analysis:');
      console.log(result.analysis);
      console.log(`\n⚡ Latency: ${result.latency}ms`);
      console.log(`🎯 Model: ${result.model}`);
      console.log(`📈 Tokens: ${result.usage.total_tokens}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('refactor')
  .description('Multi-step refactoring with AI')
  .argument('<file>', 'File to refactor')
  .argument('<goal>', 'Refactoring goal')
  .option('-m, --model <model>', 'LLM model to use')
  .option('-l, --language <lang>', 'Programming language', 'typescript')
  .option('-s, --max-steps <num>', 'Maximum steps', '5')
  .option('-o, --output <file>', 'Output file (default: overwrite input)')
  .action(async (file, goal, options) => {
    try {
      const agent = new HybridAgent({ defaultModel: options.model });
      const code = await fs.readFile(file, 'utf-8');

      console.log(`🔄 Refactoring ${file}...`);

      const result = await agent.refactor(code, goal, options.language, {
        maxSteps: parseInt(options.maxSteps)
      });

      console.log('\n📋 Refactoring Plan:');
      console.log(result.plan);

      console.log('\n📝 Steps Executed:');
      result.steps.forEach((step, i) => {
        const status = step.success ? '✅' : '❌';
        console.log(`${status} ${i + 1}. ${step.description}`);
        if (step.confidence) {
          console.log(`   Confidence: ${(step.confidence * 100).toFixed(1)}%`);
        }
      });

      if (result.successful) {
        const outputFile = options.output || file;
        await fs.writeFile(outputFile, result.finalCode);
        console.log(`\n💾 Saved to: ${outputFile}`);
      } else {
        console.log('\n⚠️  Refactoring incomplete');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('stats')
  .description('Show usage statistics')
  .action(() => {
    const agent = new HybridAgent();
    const stats = agent.getStats();

    console.log('\n📊 Usage Statistics:');
    console.log(`LLM Calls: ${stats.llmCalls}`);
    console.log(`LLM Tokens: ${stats.llmTokens}`);
    console.log(`Booster Edits: ${stats.boosterEdits}`);
    console.log(`\nAverage Latency:`);
    console.log(`  LLM: ${stats.avgLatency.llm.toFixed(2)}ms`);
    console.log(`  Booster: ${stats.avgLatency.booster.toFixed(2)}ms`);
    console.log(`\n⚡ Speedup: ${stats.speedup.toFixed(1)}x`);
  });

program.parse();
```

#### 2.2 Add to package.json
```json
{
  "bin": {
    "hybrid-agent": "./src/cli/hybrid-agent-cli.js"
  },
  "scripts": {
    "cli": "node src/cli/hybrid-agent-cli.js"
  }
}
```

---

### Phase 3: Advanced Features (Week 2-3)

#### 3.1 Model Selection Strategy
**File**: `src/strategies/ModelSelector.js`

```javascript
class ModelSelector {
  static selectModel(task, provider = 'glm', options = {}) {
    // Provider-specific model strategies
    const glmStrategies = {
      'code-analysis': {
        default: 'glm-4',
        fast: 'glm-4-flash',
        specialized: 'codegeex-4'
      },
      'code-generation': {
        default: 'codegeex-4',
        fast: 'glm-4-flash',
        quality: 'glm-4'
      },
      'refactoring': {
        default: 'glm-4',
        fast: 'glm-4-flash',
        budget: 'glm-3-turbo'
      },
      'simple-edit': {
        default: 'glm-4-flash',
        fast: 'glm-3-turbo',
        quality: 'glm-4'
      }
    };

    const openRouterStrategies = {
      'code-analysis': {
        default: 'anthropic/claude-opus-4-1-20250805',
        fast: 'google/gemini-2.5-flash',
        cheap: 'meta-llama/llama-3.1-8b-instruct:free'
      },
      'code-generation': {
        default: 'anthropic/claude-sonnet-4',
        fast: 'anthropic/claude-haiku-3.5',
        cheap: 'deepseek/deepseek-coder'
      },
      'refactoring': {
        default: 'anthropic/claude-opus-4-1-20250805',
        fast: 'anthropic/claude-sonnet-4',
        cheap: 'openai/gpt-4o-mini'
      },
      'simple-edit': {
        default: 'anthropic/claude-haiku-3.5',
        fast: 'google/gemini-2.5-flash',
        cheap: 'meta-llama/llama-3.1-8b-instruct:free'
      }
    };

    const strategies = provider === 'glm' ? glmStrategies : openRouterStrategies;

    const priority = options.priority || 'default'; // 'default', 'fast', 'cheap'
    const taskStrategy = strategies[task] || strategies['code-analysis'];

    return taskStrategy[priority] || taskStrategy.default;
  }

  static estimateCost(model, tokens) {
    // Rough cost estimation (update with real pricing)
    const pricing = {
      'anthropic/claude-opus-4': { input: 15, output: 75 },
      'anthropic/claude-sonnet-4': { input: 3, output: 15 },
      'anthropic/claude-haiku-3.5': { input: 0.8, output: 4 },
      'openai/gpt-4o': { input: 2.5, output: 10 },
      'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
      'google/gemini-flash-1.5': { input: 0.075, output: 0.3 },
      'meta-llama/llama-3.1-8b-instruct:free': { input: 0, output: 0 }
    };

    const rates = pricing[model] || { input: 1, output: 3 };
    return ((tokens.input * rates.input) + (tokens.output * rates.output)) / 1_000_000;
  }
}

module.exports = { ModelSelector };
```

#### 3.2 Caching Layer
**File**: `src/cache/CodeCache.js`

```javascript
const crypto = require('crypto');

class CodeCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 3600000; // 1 hour
  }

  generateKey(code, instruction, model) {
    const hash = crypto.createHash('sha256');
    hash.update(`${code}:${instruction}:${model}`);
    return hash.digest('hex');
  }

  get(code, instruction, model) {
    const key = this.generateKey(code, instruction, model);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(code, instruction, model, data) {
    const key = this.generateKey(code, instruction, model);

    // Evict oldest if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

module.exports = { CodeCache };
```

---

### Phase 4: Testing & Benchmarking (Week 3-4)

#### 4.1 Performance Tests
**File**: `tests/benchmark.test.js`

```javascript
const { HybridAgent } = require('../src/agents/HybridAgent');
const { performance } = require('perf_hooks');

async function runBenchmark() {
  const agent = new HybridAgent();

  const testCases = [
    {
      name: 'Add TypeScript types',
      code: 'function add(a, b) { return a + b; }',
      instruction: 'Add TypeScript type annotations',
      language: 'typescript'
    },
    {
      name: 'Add error handling',
      code: 'const data = JSON.parse(input);',
      instruction: 'Wrap in try-catch',
      language: 'javascript'
    },
    {
      name: 'Modernize syntax',
      code: 'var x = 1; var y = 2;',
      instruction: 'Use const/let instead of var',
      language: 'javascript'
    }
  ];

  console.log('🧪 Running Hybrid Agent Benchmarks\n');

  for (const test of testCases) {
    console.log(`Testing: ${test.name}`);

    const start = performance.now();
    const result = await agent.editCode(
      test.code,
      test.instruction,
      test.language
    );
    const end = performance.now();

    console.log(`  ✅ Success: ${result.success}`);
    console.log(`  🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`  ⚡ LLM Latency: ${result.latency.llm}ms`);
    console.log(`  ⚡ Booster Latency: ${result.latency.booster}ms`);
    console.log(`  ⏱️  Total: ${(end - start).toFixed(2)}ms`);
    console.log(`  🚀 Speedup: ${(result.latency.llm / result.latency.booster).toFixed(1)}x\n`);
  }

  const stats = agent.getStats();
  console.log('📊 Final Statistics:');
  console.log(`  LLM Calls: ${stats.llmCalls}`);
  console.log(`  Booster Edits: ${stats.boosterEdits}`);
  console.log(`  Avg LLM Latency: ${stats.avgLatency.llm.toFixed(2)}ms`);
  console.log(`  Avg Booster Latency: ${stats.avgLatency.booster.toFixed(2)}ms`);
  console.log(`  Overall Speedup: ${stats.speedup.toFixed(1)}x`);
}

runBenchmark().catch(console.error);
```

---

## Usage Examples

### Example 1: Simple Code Edit
```bash
# Edit a file with AI assistance
hybrid-agent edit src/utils.ts "Add JSDoc comments to all functions"
```

### Example 2: Code Analysis
```bash
# Analyze code
hybrid-agent analyze src/complex.ts "What are potential performance issues?"
```

### Example 3: Multi-Step Refactoring
```bash
# Complex refactoring
hybrid-agent refactor src/legacy.js "Modernize to ES6+ and add TypeScript types"
```

### Example 4: Programmatic Usage
```javascript
const { HybridAgent } = require('./src/agents/HybridAgent');

async function example() {
  const agent = new HybridAgent({
    defaultModel: 'anthropic/claude-sonnet-4',
    confidenceThreshold: 0.7
  });

  // Edit code
  const result = await agent.editCode(
    'function hello() { console.log("world"); }',
    'Add TypeScript types and async/await',
    'typescript'
  );

  console.log(result.output);
  console.log(`Confidence: ${result.confidence}`);
  console.log(`Speedup: ${result.latency.llm / result.latency.booster}x`);

  // Get statistics
  const stats = agent.getStats();
  console.log(`Total speedup: ${stats.speedup}x`);
}
```

---

## Cost Analysis

### Scenario: Refactor 100 Files

| Approach | LLM Calls | LLM Cost | Edit Operations | Edit Cost | Total Cost | Time |
|----------|-----------|----------|-----------------|-----------|------------|------|
| **Pure LLM** (Morph/Claude) | 100 | $5.00 | 100 (LLM) | $5.00 | **$10.00** | ~6 min |
| **Hybrid** (OpenRouter + Booster) | 100 | $5.00 | 100 (Booster) | $0.00 | **$5.00** | ~1.5 min |
| **Savings** | - | - | - | - | **50%** | **75%** |

### Annual Cost Projection (Active Development Team)

| Metric | Pure LLM | Hybrid System | Savings |
|--------|----------|---------------|---------|
| Monthly LLM calls | 10,000 | 10,000 | - |
| Monthly LLM cost | $500 | $500 | - |
| Monthly edit operations | 10,000 | 10,000 | - |
| Monthly edit cost | $500 | $0 | $500 |
| **Monthly Total** | **$1,000** | **$500** | **$500** |
| **Annual Total** | **$12,000** | **$6,000** | **$6,000** |

---

## Model Recommendations by Use Case

### Code Analysis & Understanding
#### GLM Models (Primary)
- **Best Quality**: `glm-4` ⭐ (200K context, advanced reasoning)
- **Fast & Efficient**: `glm-4-flash`
- **Code Specialized**: `codegeex-4`

#### OpenRouter Models (Fallback)
- **Best Quality**: `anthropic/claude-opus-4-1-20250805` ⭐
- **Best Balance**: `anthropic/claude-sonnet-4`
- **Fastest**: `google/gemini-2.5-flash`
- **Free**: `meta-llama/llama-3.1-70b-instruct:free`

### Code Generation
#### GLM Models (Primary)
- **Best Quality**: `glm-4` ⭐
- **Code Specialized**: `codegeex-4` ⭐ (Optimized for code)
- **Fast**: `glm-4-flash`

#### OpenRouter Models (Fallback)
- **Best Quality**: `anthropic/claude-opus-4-1-20250805`
- **Best Balance**: `anthropic/claude-sonnet-4`
- **Specialized**: `deepseek/deepseek-coder`
- **Fastest**: `anthropic/claude-haiku-3.5`

### Simple Edits (Type additions, formatting)
#### GLM Models (Primary)
- **Recommended**: `glm-4-flash` ⭐ (Fast and efficient)
- **Budget**: `glm-3-turbo`

#### OpenRouter Models (Fallback)
- **Recommended**: `anthropic/claude-haiku-3.5`
- **Ultra-fast**: `google/gemini-2.5-flash`
- **Free**: `meta-llama/llama-3.1-8b-instruct:free`

---

## Environment Setup

### Required Environment Variables
```bash
# .env file
# Primary Provider (GLM/Z.ai)
GLM_API_KEY=your_glm_key_here

# Fallback Provider (OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Provider Configuration
DEFAULT_LLM_PROVIDER=auto  # auto|glm|openrouter
DEFAULT_GLM_MODEL=glm-4
DEFAULT_OPENROUTER_MODEL=anthropic/claude-opus-4-1-20250805

# Optional
BOOSTER_CONFIDENCE_THRESHOLD=0.7
APP_NAME=My Hybrid Agent
```

### API Keys
- **GLM/Z.ai API Key**: Get from https://open.bigmodel.cn/
- **OpenRouter API Key**: Get from https://openrouter.ai/keys

---

## Testing Strategy

### Unit Tests
- Test HybridAgent class methods
- Test model selection logic
- Test caching layer

### Integration Tests
- Test OpenRouter API integration
- Test Agent Booster integration
- Test end-to-end workflows

### Benchmark Tests
- Compare against pure LLM approach
- Measure latency improvements
- Track cost savings

---

## Monitoring & Logging

### Metrics to Track
1. **Performance**
   - LLM latency (avg, p50, p95, p99)
   - Agent Booster latency
   - Total request time
   - Speedup factor

2. **Cost**
   - LLM API calls count
   - Token usage (input/output)
   - Estimated costs per operation
   - Monthly cost projection

3. **Quality**
   - Edit success rate
   - Confidence scores
   - Manual review results

### Logging Strategy
```javascript
// Add to HybridAgent
const logger = {
  info: (msg, data) => console.log(`[INFO] ${msg}`, data),
  error: (msg, error) => console.error(`[ERROR] ${msg}`, error),
  metric: (name, value) => console.log(`[METRIC] ${name}: ${value}`)
};
```

---

## Deployment Checklist

- [ ] Install dependencies (`npm install agent-booster axios openai dotenv`)
- [ ] Obtain GLM API key from https://open.bigmodel.cn/
- [ ] Set up `.env` file with `GLM_API_KEY` (primary)
- [ ] Optionally add `OPENROUTER_API_KEY` (fallback)
- [ ] Create provider adapters (GLMAdapter, OpenRouterAdapter)
- [ ] Create `HybridAgent` class with multi-provider support
- [ ] Implement CLI tool with provider selection
- [ ] Add model selection strategy for each provider
- [ ] Implement caching layer
- [ ] Write unit tests for both providers
- [ ] Run benchmarks comparing providers
- [ ] Set up monitoring/logging for provider usage
- [ ] Document usage examples for both providers
- [ ] Deploy to production with provider health checks

---

## Future Enhancements

### Phase 5: Advanced Features (Future)
1. **Streaming Support**
   - Stream LLM responses for better UX
   - Real-time progress updates
   - Support for GLM and OpenRouter streaming APIs

2. **Multi-Agent Collaboration**
   - Specialized agents for different tasks
   - Agent orchestration layer
   - Provider-specific agent routing

3. **Advanced Provider Features**
   - GLM vision capabilities for diagram analysis
   - CodeGeeX-4 deep code understanding
   - Claude Opus 4.1 complex reasoning via OpenRouter

4. **Plugin System**
   - Custom transformation templates
   - Community-contributed plugins
   - Provider-specific optimizations

5. **Web Interface**
   - Visual code editing dashboard
   - Real-time collaboration
   - Provider performance comparison dashboard

---

## Resources

### Documentation
- **Agent Booster**: https://www.npmjs.com/package/agent-booster
- **GLM/Z.ai API**: https://open.bigmodel.cn/dev/api
- **OpenRouter**: https://openrouter.ai/docs
- **OpenAI SDK**: https://github.com/openai/openai-node

### Community
- **GitHub Issues**: Track bugs and feature requests
- **Discord/Slack**: Community support
- **Examples Repository**: Real-world usage examples

---

## Support & Troubleshooting

### Common Issues

**Issue**: "No LLM provider configured"
- **Solution**: Ensure `.env` file has either `GLM_API_KEY` or `OPENROUTER_API_KEY` set

**Issue**: "GLM API key not found"
- **Solution**: Add `GLM_API_KEY=your_key` to `.env` file

**Issue**: "OpenRouter API key not found"
- **Solution**: Add `OPENROUTER_API_KEY=your_key` to `.env` file

**Issue**: "Agent Booster confidence too low"
- **Solution**: Adjust `confidenceThreshold` or use different LLM model for code generation

**Issue**: "Rate limit exceeded"
- **Solution**: Switch providers, implement request queuing, or use caching layer

**Issue**: "Provider selection not working"
- **Solution**: Check `DEFAULT_LLM_PROVIDER` setting (should be 'glm', 'openrouter', or 'auto')

---

## Conclusion

The Hybrid Agent architecture combines the best of multiple technologies:
- **GLM/Z.ai** as primary provider offers 200K context, competitive pricing, and specialized code models
- **OpenRouter** as fallback provides access to Claude Opus 4.1 and 100+ other models
- **Agent Booster** delivers ultra-fast, cost-free code editing at 352x speed

This multi-provider approach ensures:
- High availability with automatic fallback
- Optimal model selection for each task
- Cost optimization through provider competition
- 50% cost reduction and 350x performance improvement on code edits

**Next Steps**:
1. Obtain GLM API key from https://open.bigmodel.cn/
2. Set up environment variables with GLM as primary provider
3. Begin with Phase 1 implementation using GLM-4 for optimal performance

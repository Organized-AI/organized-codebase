/**
 * Hybrid Agent - Combines LLM reasoning with Agent Booster speed
 * Supports multiple LLM providers: GLM (primary), OpenRouter (fallback), Anthropic (direct)
 */

const { AgentBooster } = require('agent-booster');
const { GLMAdapter } = require('../providers/GLMAdapter');
const { OpenRouterAdapter } = require('../providers/OpenRouterAdapter');
const { AnthropicAdapter } = require('../providers/AnthropicAdapter');
require('dotenv').config();

class HybridAgent {
  constructor(config = {}) {
    // Determine which provider to use
    const provider = config.provider || process.env.DEFAULT_LLM_PROVIDER || 'auto';

    // Initialize LLM provider with priority: GLM > OpenRouter > Anthropic
    if (provider === 'glm' || (provider === 'auto' && process.env.GLM_API_KEY)) {
      this.llm = new GLMAdapter({
        apiKey: process.env.GLM_API_KEY,
        defaultModel: config.defaultModel || process.env.DEFAULT_GLM_MODEL || 'glm-4'
      });
      this.provider = 'glm';
    } else if (provider === 'openrouter' || (provider === 'auto' && process.env.OPENROUTER_API_KEY)) {
      this.llm = new OpenRouterAdapter({
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultModel: config.defaultModel || process.env.DEFAULT_OPENROUTER_MODEL || 'anthropic/claude-opus-4-1-20250805',
        appName: config.appName || process.env.APP_NAME || 'Hybrid Agent System',
        siteUrl: config.siteUrl || process.env.APP_URL || 'http://localhost:3000'
      });
      this.provider = 'openrouter';
    } else if (provider === 'anthropic' || (provider === 'auto' && process.env.ANTHROPIC_API_KEY)) {
      this.llm = new AnthropicAdapter({
        apiKey: process.env.ANTHROPIC_API_KEY,
        defaultModel: config.defaultModel || process.env.DEFAULT_ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'
      });
      this.provider = 'anthropic';
    } else {
      throw new Error('No LLM provider configured. Set GLM_API_KEY, OPENROUTER_API_KEY, or ANTHROPIC_API_KEY in .env');
    }

    // Agent Booster for ultra-fast code editing
    this.booster = new AgentBooster({
      confidenceThreshold: config.confidenceThreshold || parseFloat(process.env.BOOSTER_CONFIDENCE_THRESHOLD) || 0.7,
      maxChunks: config.maxChunks || parseInt(process.env.BOOSTER_MAX_CHUNKS) || 100
    });

    // Default model
    this.defaultModel = this.llm.defaultModel;

    // Usage tracking
    this.stats = {
      llmCalls: 0,
      llmTokens: 0,
      llmCost: 0,
      boosterEdits: 0,
      totalLatency: { llm: 0, booster: 0 }
    };
  }

  /**
   * Analyze code with LLM
   */
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
    this.stats.llmCost += response.cost || 0;
    this.stats.totalLatency.llm += latency;

    return {
      analysis: response.content,
      usage: response.usage,
      latency,
      cost: response.cost,
      model: response.model,
      provider: this.provider
    };
  }

  /**
   * Edit code using LLM + Agent Booster hybrid approach
   */
  async editCode(code, instruction, language = 'typescript', options = {}) {
    // Step 1: LLM generates the edit suggestion
    const analysisStart = Date.now();

    const response = await this.llm.chat({
      model: options.model || this.defaultModel,
      messages: [{
        role: 'user',
        content: `Apply this change: ${instruction}\n\nOriginal code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide only the modified code, no explanations.`
      }],
      temperature: options.temperature || 0.3 // Lower temp for code generation
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
    this.stats.llmCost += response.cost || 0;
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
      cost: response.cost,
      provider: this.provider,
      suggestedCode // For debugging
    };
  }

  /**
   * Batch edit multiple files
   */
  async batchEdit(files, instruction, options = {}) {
    // Step 1: LLM analyzes the batch operation
    const fileList = files.map(f => `${f.path}: ${f.language}`).join('\n');

    const planResponse = await this.llm.chat({
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
        const editResponse = await this.llm.chat({
          model: options.model || this.defaultModel,
          messages: [{
            role: 'user',
            content: `Apply: ${instruction}\n\nFile: ${file.path}\nCode:\n\`\`\`${file.language}\n${file.code}\n\`\`\``
          }],
          temperature: 0.3
        });

        let suggestedCode = editResponse.content;
        const match = suggestedCode.match(/```[\w]*\n([\s\S]*?)\n```/);
        if (match) suggestedCode = match[1];

        // Apply with Agent Booster
        const result = await this.booster.apply({
          code: file.code,
          edit: suggestedCode,
          language: file.language
        });

        // Track stats
        this.stats.llmCalls++;
        this.stats.llmTokens += editResponse.usage.total_tokens;
        this.stats.llmCost += editResponse.cost || 0;
        this.stats.boosterEdits++;

        return {
          path: file.path,
          ...result
        };
      })
    );

    return {
      plan: planResponse.content,
      results,
      summary: {
        total: files.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };
  }

  /**
   * Multi-step refactoring with LLM planning + Agent Booster execution
   */
  async refactor(code, refactoringGoal, language = 'typescript', options = {}) {
    // Step 1: LLM creates refactoring plan
    const planResponse = await this.llm.chat({
      model: options.model || this.defaultModel,
      messages: [{
        role: 'user',
        content: `Create a step-by-step refactoring plan for: ${refactoringGoal}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide numbered steps.`
      }]
    });

    const plan = planResponse.content;

    // Step 2: Execute each refactoring step
    let currentCode = code;
    const steps = [];

    // Parse steps from LLM response
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

  /**
   * Get usage statistics
   */
  getStats() {
    return {
      ...this.stats,
      provider: this.provider,
      avgLatency: {
        llm: this.stats.llmCalls > 0 ? this.stats.totalLatency.llm / this.stats.llmCalls : 0,
        booster: this.stats.boosterEdits > 0 ? this.stats.totalLatency.booster / this.stats.boosterEdits : 0
      },
      speedup: this.stats.llmCalls > 0 && this.stats.boosterEdits > 0
        ? (this.stats.totalLatency.llm / this.stats.llmCalls) / (this.stats.totalLatency.booster / this.stats.boosterEdits)
        : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      llmCalls: 0,
      llmTokens: 0,
      llmCost: 0,
      boosterEdits: 0,
      totalLatency: { llm: 0, booster: 0 }
    };
  }

  /**
   * Get provider information
   */
  getProviderInfo() {
    return {
      name: this.provider,
      model: this.defaultModel,
      stats: this.llm.getStats(),
      availableModels: this.llm.getModels()
    };
  }
}

module.exports = { HybridAgent };
/**
 * Model Selection Strategy
 * Intelligently selects optimal models based on task type and provider
 */

class ModelSelector {
  /**
   * Select optimal model based on task and provider
   * @param {string} task - Task type: 'code-analysis', 'code-generation', 'refactoring', 'simple-edit'
   * @param {string} provider - Provider: 'glm', 'openrouter', 'anthropic', 'auto'
   * @param {Object} options - Additional options: { priority: 'default'|'fast'|'quality'|'cheap' }
   * @returns {string} - Model identifier
   */
  static selectModel(task, provider = 'glm', options = {}) {
    // Provider-specific model strategies
    const glmStrategies = {
      'code-analysis': {
        default: 'glm-4',
        fast: 'glm-4-flash',
        quality: 'glm-4',
        specialized: 'codegeex-4',
        cheap: 'glm-3-turbo'
      },
      'code-generation': {
        default: 'codegeex-4',
        fast: 'glm-4-flash',
        quality: 'glm-4',
        specialized: 'codegeex-4',
        cheap: 'glm-3-turbo'
      },
      'refactoring': {
        default: 'glm-4',
        fast: 'glm-4-flash',
        quality: 'glm-4',
        specialized: 'codegeex-4',
        cheap: 'glm-3-turbo'
      },
      'simple-edit': {
        default: 'glm-4-flash',
        fast: 'glm-3-turbo',
        quality: 'glm-4',
        specialized: 'glm-4-flash',
        cheap: 'glm-3-turbo'
      }
    };

    const openRouterStrategies = {
      'code-analysis': {
        default: 'anthropic/claude-opus-4-1-20250805',
        fast: 'google/gemini-2.5-flash',
        quality: 'anthropic/claude-opus-4-1-20250805',
        specialized: 'anthropic/claude-sonnet-4',
        cheap: 'meta-llama/llama-3.1-8b-instruct:free'
      },
      'code-generation': {
        default: 'anthropic/claude-sonnet-4',
        fast: 'anthropic/claude-haiku-3.5',
        quality: 'anthropic/claude-opus-4-1-20250805',
        specialized: 'deepseek/deepseek-coder',
        cheap: 'deepseek/deepseek-coder'
      },
      'refactoring': {
        default: 'anthropic/claude-opus-4-1-20250805',
        fast: 'anthropic/claude-sonnet-4',
        quality: 'anthropic/claude-opus-4-1-20250805',
        specialized: 'anthropic/claude-opus-4-1-20250805',
        cheap: 'openai/gpt-4o-mini'
      },
      'simple-edit': {
        default: 'anthropic/claude-haiku-3.5',
        fast: 'google/gemini-2.5-flash',
        quality: 'anthropic/claude-sonnet-4',
        specialized: 'anthropic/claude-haiku-3.5',
        cheap: 'meta-llama/llama-3.1-8b-instruct:free'
      }
    };

    const anthropicStrategies = {
      'code-analysis': {
        default: 'claude-opus-4-20250514',
        fast: 'claude-3-5-haiku-20241022',
        quality: 'claude-opus-4-20250514',
        specialized: 'claude-3-5-sonnet-20241022',
        cheap: 'claude-3-5-haiku-20241022'
      },
      'code-generation': {
        default: 'claude-3-5-sonnet-20241022',
        fast: 'claude-3-5-haiku-20241022',
        quality: 'claude-opus-4-20250514',
        specialized: 'claude-3-5-sonnet-20241022',
        cheap: 'claude-3-5-haiku-20241022'
      },
      'refactoring': {
        default: 'claude-opus-4-20250514',
        fast: 'claude-3-5-sonnet-20241022',
        quality: 'claude-opus-4-20250514',
        specialized: 'claude-opus-4-20250514',
        cheap: 'claude-3-5-sonnet-20241022'
      },
      'simple-edit': {
        default: 'claude-3-5-haiku-20241022',
        fast: 'claude-3-5-haiku-20241022',
        quality: 'claude-3-5-sonnet-20241022',
        specialized: 'claude-3-5-haiku-20241022',
        cheap: 'claude-3-5-haiku-20241022'
      }
    };

    // Select strategy based on provider
    let strategies;
    if (provider === 'glm') {
      strategies = glmStrategies;
    } else if (provider === 'openrouter') {
      strategies = openRouterStrategies;
    } else if (provider === 'anthropic') {
      strategies = anthropicStrategies;
    } else {
      // Default to GLM for auto
      strategies = glmStrategies;
    }

    const priority = options.priority || 'default'; // 'default', 'fast', 'quality', 'specialized', 'cheap'
    const taskStrategy = strategies[task] || strategies['code-analysis'];

    return taskStrategy[priority] || taskStrategy.default;
  }

  /**
   * Estimate cost for a model operation
   * @param {string} model - Model identifier
   * @param {Object} tokens - Token counts { input, output }
   * @param {string} provider - Provider name
   * @returns {number} - Estimated cost in USD
   */
  static estimateCost(model, tokens, provider = 'auto') {
    if (!tokens) return 0;

    // GLM pricing (in USD, converted from CNY at ~7:1)
    const glmPricing = {
      'glm-4': { input: 0.1 / 7, output: 0.1 / 7 }, // per 1K tokens
      'glm-4-flash': { input: 0.01 / 7, output: 0.01 / 7 },
      'glm-3-turbo': { input: 0.005 / 7, output: 0.005 / 7 },
      'codegeex-4': { input: 0.01 / 7, output: 0.01 / 7 }
    };

    // OpenRouter/Anthropic pricing (per 1M tokens)
    const standardPricing = {
      'anthropic/claude-opus-4': { input: 15, output: 75 },
      'anthropic/claude-opus-4-1-20250805': { input: 15, output: 75 },
      'anthropic/claude-sonnet-4': { input: 3, output: 15 },
      'anthropic/claude-haiku-3.5': { input: 0.8, output: 4 },
      'claude-opus-4-20250514': { input: 15, output: 75 },
      'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
      'claude-3-5-haiku-20241022': { input: 0.8, output: 4 },
      'openai/gpt-4o': { input: 2.5, output: 10 },
      'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
      'google/gemini-2.5-pro': { input: 1.25, output: 5 },
      'google/gemini-2.5-flash': { input: 0.075, output: 0.3 },
      'deepseek/deepseek-coder': { input: 0.14, output: 0.28 },
      'meta-llama/llama-3.1-8b-instruct:free': { input: 0, output: 0 },
      'meta-llama/llama-3.1-70b-instruct:free': { input: 0, output: 0 }
    };

    let pricing;

    // Check GLM models first
    if (glmPricing[model]) {
      pricing = glmPricing[model];
      // GLM pricing is per 1K tokens
      return ((tokens.input / 1000) * pricing.input) + ((tokens.output / 1000) * pricing.output);
    }

    // Check standard pricing
    pricing = standardPricing[model];
    if (!pricing) {
      // Try partial match for model families
      for (const [modelPattern, modelPricing] of Object.entries(standardPricing)) {
        if (model.includes(modelPattern.split('/')[1]) || model.includes(modelPattern)) {
          pricing = modelPricing;
          break;
        }
      }
    }

    // Default pricing if not found
    if (!pricing) {
      pricing = { input: 1, output: 3 };
    }

    // Standard pricing is per 1M tokens
    return ((tokens.input / 1_000_000) * pricing.input) + ((tokens.output / 1_000_000) * pricing.output);
  }

  /**
   * Get recommended models for a specific task across all providers
   * @param {string} task - Task type
   * @returns {Object} - Recommendations by provider
   */
  static getRecommendations(task) {
    return {
      glm: {
        recommended: this.selectModel(task, 'glm', { priority: 'default' }),
        fast: this.selectModel(task, 'glm', { priority: 'fast' }),
        quality: this.selectModel(task, 'glm', { priority: 'quality' }),
        specialized: this.selectModel(task, 'glm', { priority: 'specialized' }),
        cheap: this.selectModel(task, 'glm', { priority: 'cheap' })
      },
      openrouter: {
        recommended: this.selectModel(task, 'openrouter', { priority: 'default' }),
        fast: this.selectModel(task, 'openrouter', { priority: 'fast' }),
        quality: this.selectModel(task, 'openrouter', { priority: 'quality' }),
        specialized: this.selectModel(task, 'openrouter', { priority: 'specialized' }),
        cheap: this.selectModel(task, 'openrouter', { priority: 'cheap' })
      },
      anthropic: {
        recommended: this.selectModel(task, 'anthropic', { priority: 'default' }),
        fast: this.selectModel(task, 'anthropic', { priority: 'fast' }),
        quality: this.selectModel(task, 'anthropic', { priority: 'quality' }),
        specialized: this.selectModel(task, 'anthropic', { priority: 'specialized' }),
        cheap: this.selectModel(task, 'anthropic', { priority: 'cheap' })
      }
    };
  }
}

module.exports = { ModelSelector };
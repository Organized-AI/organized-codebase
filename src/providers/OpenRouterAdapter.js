/**
 * OpenRouter Adapter
 * Provides access to 100+ models from multiple providers
 */

const { LLMProvider } = require('./LLMProvider');
const axios = require('axios');

class OpenRouterAdapter extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'openrouter';
    this.apiKey = config.apiKey || process.env.OPENROUTER_API_KEY;
    this.baseURL = config.baseURL || 'https://openrouter.ai/api/v1';
    this.defaultModel = config.defaultModel || 'anthropic/claude-opus-4-1-20250805';

    // OpenRouter-specific headers
    this.appName = config.appName || process.env.APP_NAME || 'Hybrid Agent System';
    this.siteUrl = config.siteUrl || process.env.APP_URL || 'http://localhost:3000';

    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable or pass apiKey in config');
    }

    // Initialize axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': this.siteUrl,
        'X-Title': this.appName
      },
      timeout: config.timeout || 60000
    });

    // Cache models list
    this.modelsCache = null;
    this.modelsCacheTime = 0;
    this.modelsCacheTTL = 3600000; // 1 hour
  }

  /**
   * Get available models from OpenRouter
   */
  async getModels() {
    // Return cached models if still valid
    if (this.modelsCache && (Date.now() - this.modelsCacheTime < this.modelsCacheTTL)) {
      return this.modelsCache;
    }

    try {
      const response = await this.client.get('/models');
      const models = response.data.data || [];

      // Transform to our standard format and filter relevant models
      this.modelsCache = models
        .filter(model => model.id && model.pricing)
        .map(model => ({
          id: model.id,
          name: model.name || model.id,
          description: model.description || '',
          contextWindow: model.context_length || 4096,
          pricing: {
            input: parseFloat(model.pricing.prompt) * 1000000, // Convert to per token
            output: parseFloat(model.pricing.completion) * 1000000
          },
          capabilities: this.inferCapabilities(model),
          provider: model.id.split('/')[0],
          topProvider: model.top_provider
        }));

      // Add our recommended models at the top
      const recommendedModels = [
        {
          id: 'anthropic/claude-opus-4-1-20250805',
          name: 'Claude Opus 4.1',
          description: 'Most capable Claude model with advanced reasoning',
          contextWindow: 200000,
          pricing: { input: 15, output: 75 },
          capabilities: ['chat', 'code', 'reasoning', 'vision'],
          provider: 'anthropic',
          recommended: true
        },
        {
          id: 'anthropic/claude-sonnet-4',
          name: 'Claude Sonnet 4',
          description: 'Balanced performance and cost',
          contextWindow: 200000,
          pricing: { input: 3, output: 15 },
          capabilities: ['chat', 'code', 'reasoning', 'vision'],
          provider: 'anthropic',
          recommended: true
        },
        {
          id: 'google/gemini-2.5-flash',
          name: 'Gemini 2.5 Flash',
          description: 'Ultra-fast responses',
          contextWindow: 1000000,
          pricing: { input: 0.075, output: 0.3 },
          capabilities: ['chat', 'code', 'reasoning'],
          provider: 'google',
          recommended: true
        },
        {
          id: 'deepseek/deepseek-coder',
          name: 'DeepSeek Coder',
          description: 'Specialized for code generation',
          contextWindow: 16384,
          pricing: { input: 0.14, output: 0.28 },
          capabilities: ['code'],
          provider: 'deepseek',
          recommended: true
        }
      ];

      // Merge recommended models with fetched models
      const mergedModels = [...recommendedModels];
      for (const model of this.modelsCache) {
        if (!mergedModels.find(m => m.id === model.id)) {
          mergedModels.push(model);
        }
      }

      this.modelsCache = mergedModels;
      this.modelsCacheTime = Date.now();

      return this.modelsCache;

    } catch (error) {
      console.error('Failed to fetch OpenRouter models:', error.message);

      // Return default models if API fails
      return this.getDefaultModels();
    }
  }

  /**
   * Get default models when API is unavailable
   */
  getDefaultModels() {
    return [
      {
        id: 'anthropic/claude-opus-4-1-20250805',
        name: 'Claude Opus 4.1',
        description: 'Most capable Claude model',
        contextWindow: 200000,
        pricing: { input: 15, output: 75 },
        capabilities: ['chat', 'code', 'reasoning', 'vision'],
        provider: 'anthropic'
      },
      {
        id: 'anthropic/claude-sonnet-4',
        name: 'Claude Sonnet 4',
        description: 'Balanced performance',
        contextWindow: 200000,
        pricing: { input: 3, output: 15 },
        capabilities: ['chat', 'code', 'reasoning', 'vision'],
        provider: 'anthropic'
      },
      {
        id: 'anthropic/claude-haiku-3.5',
        name: 'Claude Haiku 3.5',
        description: 'Fast and efficient',
        contextWindow: 200000,
        pricing: { input: 0.8, output: 4 },
        capabilities: ['chat', 'code'],
        provider: 'anthropic'
      },
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        description: 'OpenAI flagship model',
        contextWindow: 128000,
        pricing: { input: 2.5, output: 10 },
        capabilities: ['chat', 'code', 'reasoning', 'vision'],
        provider: 'openai'
      },
      {
        id: 'google/gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Google advanced model',
        contextWindow: 1000000,
        pricing: { input: 1.25, output: 5 },
        capabilities: ['chat', 'code', 'reasoning', 'vision'],
        provider: 'google'
      },
      {
        id: 'meta-llama/llama-3.1-70b-instruct:free',
        name: 'Llama 3.1 70B (Free)',
        description: 'Free open-source model',
        contextWindow: 131072,
        pricing: { input: 0, output: 0 },
        capabilities: ['chat', 'code'],
        provider: 'meta-llama'
      }
    ];
  }

  /**
   * Infer model capabilities from model data
   */
  inferCapabilities(model) {
    const capabilities = ['chat']; // All models support chat

    const modelId = model.id.toLowerCase();

    // Check for code capabilities
    if (modelId.includes('code') || modelId.includes('coder') ||
        modelId.includes('claude') || modelId.includes('gpt') ||
        modelId.includes('gemini')) {
      capabilities.push('code');
    }

    // Check for vision capabilities
    if (modelId.includes('vision') || modelId.includes('4o') ||
        modelId.includes('claude-3') || modelId.includes('claude-opus-4') ||
        modelId.includes('gemini')) {
      capabilities.push('vision');
    }

    // Check for reasoning capabilities
    if (modelId.includes('opus') || modelId.includes('gpt-4') ||
        modelId.includes('gemini') || modelId.includes('claude')) {
      capabilities.push('reasoning');
    }

    return capabilities;
  }

  /**
   * Send chat completion request to OpenRouter
   */
  async chat(params) {
    const startTime = Date.now();
    let usage = null;
    let cost = 0;
    let error = false;

    try {
      const request = this.formatRequest(params);

      // Add OpenRouter-specific parameters
      if (params.provider) {
        request.provider = params.provider;
      }

      const response = await this.withRetry(async () => {
        return await this.client.post('/chat/completions', request);
      });

      const result = this.parseResponse(response.data);

      // Calculate usage and cost
      usage = result.usage;
      cost = this.estimateCost(params.model || this.defaultModel, usage);

      // Add metadata
      result.latency = Date.now() - startTime;
      result.cost = cost;

      return result;

    } catch (err) {
      error = true;

      if (err.response) {
        const errorData = err.response.data;
        const errorMessage = errorData?.error?.message || errorData?.message || 'OpenRouter API error';

        // Handle OpenRouter-specific errors
        if (err.response.status === 402) {
          throw new Error('OpenRouter: Insufficient credits. Please add credits to your account.');
        } else if (err.response.status === 429) {
          throw new Error('OpenRouter: Rate limit exceeded. Please wait before retrying.');
        }

        throw new Error(`OpenRouter API Error (${err.response.status}): ${errorMessage}`);
      } else if (err.request) {
        throw new Error('OpenRouter API request failed - no response received');
      } else {
        throw err;
      }
    } finally {
      const latency = Date.now() - startTime;
      this.updateStats(usage, latency, cost, error);
    }
  }

  /**
   * Format request for OpenRouter API
   */
  formatRequest(params) {
    const request = {
      model: params.model || this.defaultModel,
      messages: params.messages,
      temperature: params.temperature !== undefined ? params.temperature : 0.7,
      max_tokens: params.maxTokens || params.max_tokens || 2000,
      stream: params.stream || false
    };

    // Add optional standard parameters
    if (params.top_p !== undefined) request.top_p = params.top_p;
    if (params.stop !== undefined) request.stop = params.stop;
    if (params.presence_penalty !== undefined) request.presence_penalty = params.presence_penalty;
    if (params.frequency_penalty !== undefined) request.frequency_penalty = params.frequency_penalty;
    if (params.seed !== undefined) request.seed = params.seed;

    // OpenRouter-specific parameters
    if (params.route !== undefined) request.route = params.route;
    if (params.transforms !== undefined) request.transforms = params.transforms;
    if (params.models !== undefined) request.models = params.models; // For model routing

    return request;
  }

  /**
   * Parse OpenRouter response to standard format
   */
  parseResponse(response) {
    const choice = response.choices?.[0];

    return {
      content: choice?.message?.content || '',
      role: choice?.message?.role || 'assistant',
      model: response.model || this.defaultModel,
      usage: {
        total_tokens: response.usage?.total_tokens || 0,
        input_tokens: response.usage?.prompt_tokens || 0,
        output_tokens: response.usage?.completion_tokens || 0
      },
      finish_reason: choice?.finish_reason,
      provider: this.name,
      actualProvider: response.provider, // OpenRouter tells us which provider was used
      raw: response // Include raw response for debugging
    };
  }

  /**
   * Estimate cost for OpenRouter usage
   */
  estimateCost(model, usage) {
    if (!usage) return 0;

    // Try to get pricing from cached models
    if (this.modelsCache) {
      const modelInfo = this.modelsCache.find(m => m.id === model);
      if (modelInfo && modelInfo.pricing) {
        const inputCost = (usage.input_tokens * modelInfo.pricing.input) / 1000000;
        const outputCost = (usage.output_tokens * modelInfo.pricing.output) / 1000000;
        return inputCost + outputCost;
      }
    }

    // Fallback to default pricing estimates
    const defaultPricing = {
      'anthropic/claude-opus-4': { input: 15, output: 75 },
      'anthropic/claude-sonnet-4': { input: 3, output: 15 },
      'anthropic/claude-haiku-3.5': { input: 0.8, output: 4 },
      'openai/gpt-4o': { input: 2.5, output: 10 },
      'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
      'google/gemini-2.5-pro': { input: 1.25, output: 5 },
      'google/gemini-2.5-flash': { input: 0.075, output: 0.3 }
    };

    // Find pricing for model or use generic estimate
    let pricing = { input: 1, output: 3 }; // Default generic pricing

    for (const [modelPattern, modelPricing] of Object.entries(defaultPricing)) {
      if (model.includes(modelPattern.split('/')[1])) {
        pricing = modelPricing;
        break;
      }
    }

    const inputCost = (usage.input_tokens * pricing.input) / 1000000;
    const outputCost = (usage.output_tokens * pricing.output) / 1000000;

    return inputCost + outputCost;
  }

  /**
   * Stream chat completion
   */
  async *streamChat(params) {
    const request = this.formatRequest({ ...params, stream: true });

    try {
      const response = await this.client.post('/chat/completions', request, {
        responseType: 'stream'
      });

      let buffer = '';

      for await (const chunk of response.data) {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;

              if (delta?.content) {
                yield {
                  content: delta.content,
                  role: delta.role || 'assistant',
                  finish_reason: parsed.choices?.[0]?.finish_reason
                };
              }
            } catch (e) {
              console.error('Failed to parse streaming response:', e);
            }
          }
        }
      }
    } catch (error) {
      throw new Error(`OpenRouter streaming error: ${error.message}`);
    }
  }
}

module.exports = { OpenRouterAdapter };
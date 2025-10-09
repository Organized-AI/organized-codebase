/**
 * Anthropic Adapter
 * Direct integration with Anthropic's Claude API
 */

const { LLMProvider } = require('./LLMProvider');
const Anthropic = require('@anthropic-ai/sdk');

class AnthropicAdapter extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'anthropic';
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
    this.defaultModel = config.defaultModel || 'claude-3-5-sonnet-20241022';

    if (!this.apiKey) {
      throw new Error('Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable or pass apiKey in config');
    }

    // Initialize Anthropic SDK
    this.client = new Anthropic({
      apiKey: this.apiKey
    });

    // Cache models list
    this.modelsCache = null;
  }

  /**
   * Get available Anthropic models
   */
  getModels() {
    if (this.modelsCache) {
      return this.modelsCache;
    }

    this.modelsCache = [
      {
        id: 'claude-opus-4-20250514',
        name: 'Claude Opus 4',
        description: 'Most capable Claude model with advanced reasoning',
        contextWindow: 200000,
        pricing: { input: 15, output: 75 },
        capabilities: ['chat', 'code', 'reasoning', 'vision']
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'Balanced performance and cost',
        contextWindow: 200000,
        pricing: { input: 3, output: 15 },
        capabilities: ['chat', 'code', 'reasoning', 'vision']
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: 'Fast and efficient',
        contextWindow: 200000,
        pricing: { input: 0.8, output: 4 },
        capabilities: ['chat', 'code', 'vision']
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Previous generation flagship',
        contextWindow: 200000,
        pricing: { input: 15, output: 75 },
        capabilities: ['chat', 'code', 'reasoning', 'vision']
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'Previous generation balanced',
        contextWindow: 200000,
        pricing: { input: 3, output: 15 },
        capabilities: ['chat', 'code', 'vision']
      }
    ];

    return this.modelsCache;
  }

  /**
   * Send chat completion request to Anthropic
   */
  async chat(params) {
    const startTime = Date.now();
    let usage = null;
    let cost = 0;
    let error = false;

    try {
      const request = this.formatRequest(params);

      const response = await this.withRetry(async () => {
        return await this.client.messages.create(request);
      });

      const result = this.parseResponse(response);

      // Calculate usage and cost
      usage = result.usage;
      cost = this.estimateCost(params.model || this.defaultModel, usage);

      // Add metadata
      result.latency = Date.now() - startTime;
      result.cost = cost;

      return result;

    } catch (err) {
      error = true;

      if (err.status) {
        const errorMessage = err.message || 'Anthropic API error';

        // Handle Anthropic-specific errors
        if (err.status === 429) {
          throw new Error('Anthropic: Rate limit exceeded. Please wait before retrying.');
        } else if (err.status === 401) {
          throw new Error('Anthropic: Invalid API key.');
        } else if (err.status === 400) {
          throw new Error(`Anthropic: Bad request - ${errorMessage}`);
        }

        throw new Error(`Anthropic API Error (${err.status}): ${errorMessage}`);
      } else {
        throw err;
      }
    } finally {
      const latency = Date.now() - startTime;
      this.updateStats(usage, latency, cost, error);
    }
  }

  /**
   * Format request for Anthropic API
   */
  formatRequest(params) {
    // Separate system messages from other messages
    const messages = params.messages || [];
    let systemMessage = null;
    const conversationMessages = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemMessage = msg.content;
      } else {
        conversationMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      }
    }

    const request = {
      model: params.model || this.defaultModel,
      messages: conversationMessages,
      max_tokens: params.maxTokens || params.max_tokens || 2000
    };

    // Add system message if present
    if (systemMessage) {
      request.system = systemMessage;
    }

    // Add optional parameters
    if (params.temperature !== undefined) request.temperature = params.temperature;
    if (params.top_p !== undefined) request.top_p = params.top_p;
    if (params.top_k !== undefined) request.top_k = params.top_k;
    if (params.stop_sequences !== undefined) request.stop_sequences = params.stop_sequences;
    if (params.stream !== undefined) request.stream = params.stream;

    // Anthropic-specific parameters
    if (params.metadata !== undefined) request.metadata = params.metadata;

    return request;
  }

  /**
   * Parse Anthropic response to standard format
   */
  parseResponse(response) {
    return {
      content: response.content[0]?.text || '',
      role: response.role || 'assistant',
      model: response.model || this.defaultModel,
      usage: {
        total_tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
        input_tokens: response.usage?.input_tokens || 0,
        output_tokens: response.usage?.output_tokens || 0
      },
      finish_reason: response.stop_reason,
      provider: this.name,
      raw: response
    };
  }

  /**
   * Estimate cost for Anthropic usage
   */
  estimateCost(model, usage) {
    if (!usage) return 0;

    const models = this.getModels();
    const modelInfo = models.find(m => m.id === model);

    if (!modelInfo) {
      // Default pricing
      return ((usage.input_tokens * 3) + (usage.output_tokens * 15)) / 1_000_000;
    }

    const inputCost = (usage.input_tokens * modelInfo.pricing.input) / 1_000_000;
    const outputCost = (usage.output_tokens * modelInfo.pricing.output) / 1_000_000;

    return inputCost + outputCost;
  }

  /**
   * Check if Anthropic API is available
   */
  async isAvailable() {
    try {
      // Simple health check - try to make a minimal request
      const response = await this.chat({
        messages: [{ role: 'user', content: 'Hello' }],
        maxTokens: 1,
        model: 'claude-3-5-haiku-20241022' // Use cheaper model for health check
      });

      return !!response.content;
    } catch (error) {
      console.error('Anthropic API availability check failed:', error.message);
      return false;
    }
  }

  /**
   * Stream chat completion
   */
  async *streamChat(params) {
    const request = this.formatRequest({ ...params, stream: true });

    try {
      const stream = await this.client.messages.create(request);

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          yield {
            content: chunk.delta?.text || '',
            role: 'assistant',
            finish_reason: null
          };
        } else if (chunk.type === 'message_stop') {
          return;
        }
      }
    } catch (error) {
      throw new Error(`Anthropic streaming error: ${error.message}`);
    }
  }
}

module.exports = { AnthropicAdapter };
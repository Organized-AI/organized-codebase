/**
 * GLM API Adapter
 * Supports GLM-4, GLM-3, and other GLM models
 */

const { LLMProvider } = require('./LLMProvider');
const axios = require('axios');

class GLMAdapter extends LLMProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'glm';
    this.apiKey = config.apiKey || process.env.GLM_API_KEY;
    this.baseURL = config.baseURL || 'https://open.bigmodel.cn/api/paas/v4';
    this.defaultModel = config.defaultModel || 'glm-4';

    if (!this.apiKey) {
      throw new Error('GLM API key is required. Set GLM_API_KEY environment variable or pass apiKey in config');
    }

    // Initialize axios instance with defaults
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: config.timeout || 60000
    });
  }

  /**
   * Get available GLM models
   */
  getModels() {
    return [
      {
        id: 'glm-4',
        name: 'GLM-4',
        description: 'Most capable GLM model with 200K context',
        contextWindow: 200000,
        pricing: { input: 0.1, output: 0.1 }, // per 1K tokens in CNY
        capabilities: ['chat', 'code', 'reasoning', 'vision']
      },
      {
        id: 'glm-4-flash',
        name: 'GLM-4 Flash',
        description: 'Fast and efficient GLM model',
        contextWindow: 128000,
        pricing: { input: 0.01, output: 0.01 }, // per 1K tokens in CNY
        capabilities: ['chat', 'code']
      },
      {
        id: 'glm-3-turbo',
        name: 'GLM-3 Turbo',
        description: 'Balanced performance and cost',
        contextWindow: 128000,
        pricing: { input: 0.005, output: 0.005 }, // per 1K tokens in CNY
        capabilities: ['chat', 'code']
      },
      {
        id: 'codegeex-4',
        name: 'CodeGeeX-4',
        description: 'Specialized code generation model',
        contextWindow: 128000,
        pricing: { input: 0.01, output: 0.01 }, // per 1K tokens in CNY
        capabilities: ['code']
      }
    ];
  }

  /**
   * Send chat completion request to GLM API
   */
  async chat(params) {
    const startTime = Date.now();
    let usage = null;
    let cost = 0;
    let error = false;

    try {
      const request = this.formatRequest(params);

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

      // Enhanced error handling for GLM-specific errors
      if (err.response) {
        const errorData = err.response.data;
        const errorMessage = errorData?.error?.message || errorData?.message || 'GLM API error';

        throw new Error(`GLM API Error (${err.response.status}): ${errorMessage}`);
      } else if (err.request) {
        throw new Error('GLM API request failed - no response received');
      } else {
        throw err;
      }
    } finally {
      const latency = Date.now() - startTime;
      this.updateStats(usage, latency, cost, error);
    }
  }

  /**
   * Format request for GLM API
   */
  formatRequest(params) {
    const request = {
      model: params.model || this.defaultModel,
      messages: this.formatMessages(params.messages),
      temperature: params.temperature !== undefined ? params.temperature : 0.7,
      max_tokens: params.maxTokens || params.max_tokens || 2000,
      stream: params.stream || false
    };

    // Add optional parameters
    if (params.top_p !== undefined) request.top_p = params.top_p;
    if (params.stop !== undefined) request.stop = params.stop;
    if (params.presence_penalty !== undefined) request.presence_penalty = params.presence_penalty;
    if (params.frequency_penalty !== undefined) request.frequency_penalty = params.frequency_penalty;
    if (params.tools !== undefined) request.tools = params.tools;
    if (params.tool_choice !== undefined) request.tool_choice = params.tool_choice;

    // GLM-specific parameters
    if (params.do_sample !== undefined) request.do_sample = params.do_sample;
    if (params.request_id !== undefined) request.request_id = params.request_id;

    return request;
  }

  /**
   * Format messages for GLM API
   * GLM has specific requirements for message formatting
   */
  formatMessages(messages) {
    return messages.map(msg => {
      // Handle different message formats
      if (typeof msg === 'string') {
        return { role: 'user', content: msg };
      }

      // Ensure role is valid for GLM
      const validRoles = ['system', 'user', 'assistant', 'function'];
      const role = validRoles.includes(msg.role) ? msg.role : 'user';

      // Handle content with images (for GLM-4 vision)
      if (Array.isArray(msg.content)) {
        return {
          role,
          content: msg.content.map(item => {
            if (item.type === 'text') {
              return { type: 'text', text: item.text || item.content };
            } else if (item.type === 'image_url') {
              return {
                type: 'image_url',
                image_url: {
                  url: item.image_url?.url || item.url
                }
              };
            }
            return item;
          })
        };
      }

      return {
        role,
        content: msg.content
      };
    });
  }

  /**
   * Parse GLM API response to standard format
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
      raw: response // Include raw response for debugging
    };
  }

  /**
   * Estimate cost for GLM API usage
   * Prices are in CNY, convert to USD (approximate rate: 1 USD = 7 CNY)
   */
  estimateCost(model, usage) {
    if (!usage) return 0;

    const models = this.getModels();
    const modelInfo = models.find(m => m.id === model) || models[0];

    const inputCost = (usage.input_tokens / 1000) * modelInfo.pricing.input;
    const outputCost = (usage.output_tokens / 1000) * modelInfo.pricing.output;

    // Convert CNY to USD
    const totalCostCNY = inputCost + outputCost;
    const totalCostUSD = totalCostCNY / 7;

    return totalCostUSD;
  }

  /**
   * Check if GLM API is available
   */
  async isAvailable() {
    try {
      // Simple health check - try to make a minimal request
      const response = await this.chat({
        messages: [{ role: 'user', content: 'Hello' }],
        maxTokens: 1,
        model: 'glm-3-turbo' // Use cheaper model for health check
      });

      return !!response.content;
    } catch (error) {
      console.error('GLM API availability check failed:', error.message);
      return false;
    }
  }

  /**
   * Stream chat completion (GLM supports streaming)
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
      throw new Error(`GLM streaming error: ${error.message}`);
    }
  }
}

module.exports = { GLMAdapter };
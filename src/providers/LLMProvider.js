/**
 * Unified LLM Provider Interface
 * Supports multiple LLM providers with a consistent API
 */

class LLMProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = 'base';
    this.stats = {
      totalRequests: 0,
      totalTokens: { input: 0, output: 0 },
      totalCost: 0,
      totalLatency: 0,
      errors: 0
    };
  }

  /**
   * Send a chat completion request
   * @param {Object} params Request parameters
   * @returns {Promise<Object>} Response with standardized format
   */
  async chat(params) {
    throw new Error('chat() must be implemented by subclass');
  }

  /**
   * Get available models for this provider
   * @returns {Array<Object>} List of available models with metadata
   */
  getModels() {
    throw new Error('getModels() must be implemented by subclass');
  }

  /**
   * Estimate cost for a request
   * @param {string} model Model identifier
   * @param {Object} tokens Token counts {input, output}
   * @returns {number} Estimated cost in USD
   */
  estimateCost(model, tokens) {
    throw new Error('estimateCost() must be implemented by subclass');
  }

  /**
   * Check if provider is available
   * @returns {Promise<boolean>} Provider availability status
   */
  async isAvailable() {
    try {
      // Simple health check - try to get models
      const models = await this.getModels();
      return models && models.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Format request for provider-specific API
   * @param {Object} params Standardized parameters
   * @returns {Object} Provider-specific request format
   */
  formatRequest(params) {
    // Default implementation - subclasses can override
    return {
      model: params.model,
      messages: params.messages,
      temperature: params.temperature || 0.7,
      max_tokens: params.maxTokens || 2000,
      stream: params.stream || false
    };
  }

  /**
   * Parse provider response to standard format
   * @param {Object} response Provider-specific response
   * @returns {Object} Standardized response
   */
  parseResponse(response) {
    // Default implementation - subclasses should override
    return {
      content: response.choices?.[0]?.message?.content || '',
      model: response.model,
      usage: response.usage || { total_tokens: 0, input_tokens: 0, output_tokens: 0 },
      finish_reason: response.choices?.[0]?.finish_reason,
      provider: this.name
    };
  }

  /**
   * Update statistics after a request
   * @param {Object} usage Token usage
   * @param {number} latency Request latency in ms
   * @param {number} cost Estimated cost
   * @param {boolean} error Whether request errored
   */
  updateStats(usage, latency, cost = 0, error = false) {
    this.stats.totalRequests++;
    if (usage) {
      this.stats.totalTokens.input += usage.input_tokens || 0;
      this.stats.totalTokens.output += usage.output_tokens || 0;
    }
    this.stats.totalLatency += latency;
    this.stats.totalCost += cost;
    if (error) this.stats.errors++;
  }

  /**
   * Get provider statistics
   * @returns {Object} Provider usage statistics
   */
  getStats() {
    return {
      ...this.stats,
      avgLatency: this.stats.totalRequests > 0
        ? this.stats.totalLatency / this.stats.totalRequests
        : 0,
      successRate: this.stats.totalRequests > 0
        ? (this.stats.totalRequests - this.stats.errors) / this.stats.totalRequests
        : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalRequests: 0,
      totalTokens: { input: 0, output: 0 },
      totalCost: 0,
      totalLatency: 0,
      errors: 0
    };
  }

  /**
   * Handle rate limiting with exponential backoff
   * @param {Function} fn Function to execute
   * @param {number} maxRetries Maximum retry attempts
   * @returns {Promise<any>} Function result
   */
  async withRetry(fn, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Check if error is rate limit
        if (error.status === 429 || error.message?.includes('rate limit')) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          console.log(`Rate limited. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (error.status >= 500) {
          // Server error - retry with backoff
          const delay = Math.min(500 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Non-retryable error
          throw error;
        }
      }
    }

    throw lastError;
  }
}

module.exports = { LLMProvider };
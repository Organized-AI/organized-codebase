/**
 * Code Cache
 * Caches LLM responses to reduce API calls and costs
 */

const crypto = require('crypto');

class CodeCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 3600000; // 1 hour default
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Generate cache key from code, instruction, and model
   */
  generateKey(code, instruction, model) {
    const hash = crypto.createHash('sha256');
    hash.update(`${code}:${instruction}:${model}`);
    return hash.digest('hex');
  }

  /**
   * Get cached result
   */
  get(code, instruction, model) {
    const key = this.generateKey(code, instruction, model);
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data;
  }

  /**
   * Set cache entry
   */
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

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) : 0,
      totalRequests: total
    };
  }

  /**
   * Clean expired entries
   */
  cleanExpired() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get remaining TTL for a key
   */
  getTTL(code, instruction, model) {
    const key = this.generateKey(code, instruction, model);
    const entry = this.cache.get(key);

    if (!entry) return 0;

    const remaining = this.ttl - (Date.now() - entry.timestamp);
    return Math.max(0, remaining);
  }
}

module.exports = { CodeCache };
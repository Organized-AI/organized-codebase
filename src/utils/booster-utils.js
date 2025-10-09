/**
 * Standalone Agent Booster Utilities
 * Fast code transformations without LLM overhead
 */

const { AgentBooster } = require('agent-booster');
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');

const globAsync = promisify(glob);

class BoosterUtils {
  constructor(config = {}) {
    this.booster = new AgentBooster({
      confidenceThreshold: config.confidenceThreshold || 0.7,
      maxChunks: config.maxChunks || 100
    });

    this.stats = {
      filesProcessed: 0,
      totalEdits: 0,
      successfulEdits: 0,
      failedEdits: 0,
      totalLatency: 0
    };
  }

  /**
   * Apply transformation to a single file
   */
  async transformFile(filePath, transform, options = {}) {
    const startTime = Date.now();

    try {
      // Read file
      const code = await fs.readFile(filePath, 'utf-8');

      // Detect language from file extension
      const language = options.language || this.detectLanguage(filePath);

      // Apply transformation
      const result = await this.booster.apply({
        code,
        edit: transform,
        language
      });

      // Write back if successful
      if (result.success && result.confidence >= this.booster.confidenceThreshold) {
        if (!options.dryRun) {
          await fs.writeFile(filePath, result.output, 'utf-8');
        }

        this.stats.filesProcessed++;
        this.stats.totalEdits++;
        this.stats.successfulEdits++;
        this.stats.totalLatency += Date.now() - startTime;

        return {
          success: true,
          filePath,
          confidence: result.confidence,
          strategy: result.strategy,
          latency: Date.now() - startTime,
          dryRun: options.dryRun || false
        };
      } else {
        this.stats.failedEdits++;
        return {
          success: false,
          filePath,
          confidence: result.confidence,
          reason: 'Low confidence or transformation failed',
          latency: Date.now() - startTime
        };
      }
    } catch (error) {
      this.stats.failedEdits++;
      return {
        success: false,
        filePath,
        error: error.message,
        latency: Date.now() - startTime
      };
    }
  }

  /**
   * Batch transform multiple files
   */
  async transformFiles(pattern, transform, options = {}) {
    const files = await globAsync(pattern, {
      ignore: options.ignore || ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**']
    });

    console.log(`Found ${files.length} files matching pattern: ${pattern}`);

    const results = await Promise.all(
      files.map(file => this.transformFile(file, transform, options))
    );

    return {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  /**
   * Add TypeScript types to JavaScript files
   */
  async addTypeScriptTypes(pattern, options = {}) {
    const files = await globAsync(pattern, {
      ignore: options.ignore || ['**/node_modules/**', '**/*.d.ts']
    });

    const results = [];

    for (const file of files) {
      const code = await fs.readFile(file, 'utf-8');

      // Create TypeScript version
      const typedCode = code
        .replace(/function\s+(\w+)\s*\(/g, 'function $1(')
        .replace(/const\s+(\w+)\s*=/g, 'const $1: any =')
        .replace(/let\s+(\w+)\s*=/g, 'let $1: any =');

      const result = await this.booster.apply({
        code,
        edit: typedCode,
        language: 'typescript'
      });

      if (result.success && !options.dryRun) {
        const newPath = file.replace(/\.js$/, '.ts');
        await fs.writeFile(newPath, result.output, 'utf-8');
        results.push({ success: true, from: file, to: newPath });
      } else {
        results.push({ success: false, file, reason: 'Transformation failed' });
      }
    }

    return results;
  }

  /**
   * Add error handling wrappers
   */
  async addErrorHandling(pattern, options = {}) {
    const wrapInTryCatch = (code) => {
      // Simple wrapper - Agent Booster will intelligently apply it
      return `try {\n${code}\n} catch (error) {\n  console.error(error);\n}`;
    };

    return this.transformFiles(pattern, wrapInTryCatch, options);
  }

  /**
   * Modernize JavaScript syntax (var -> const/let)
   */
  async modernizeSyntax(pattern, options = {}) {
    const files = await globAsync(pattern);
    const results = [];

    for (const file of files) {
      const code = await fs.readFile(file, 'utf-8');

      // Create modernized version
      const modernCode = code
        .replace(/var\s+(\w+)\s*=\s*require/g, 'const $1 = require')
        .replace(/var\s+(\w+)\s*=\s*(['"`])/g, 'const $1 = $2')
        .replace(/var\s+/g, 'let ');

      const result = await this.booster.apply({
        code,
        edit: modernCode,
        language: 'javascript'
      });

      if (result.success && !options.dryRun) {
        await fs.writeFile(file, result.output, 'utf-8');
        this.stats.successfulEdits++;
      }

      results.push({ file, success: result.success, confidence: result.confidence });
    }

    return results;
  }

  /**
   * Apply template to multiple files
   */
  async applyTemplate(files, templateFn, options = {}) {
    const results = [];

    for (const file of files) {
      const code = await fs.readFile(file, 'utf-8');
      const transform = templateFn(code, file);

      const result = await this.transformFile(file, transform, options);
      results.push(result);
    }

    return results;
  }

  /**
   * Add JSDoc comments to functions
   */
  async addJSDoc(pattern, options = {}) {
    const files = await globAsync(pattern);
    const results = [];

    for (const file of files) {
      const code = await fs.readFile(file, 'utf-8');

      // Add JSDoc template before functions
      const withJSDoc = code.replace(
        /(export\s+)?function\s+(\w+)\s*\(/g,
        '/**\n * $2\n */\n$1function $2('
      );

      const result = await this.booster.apply({
        code,
        edit: withJSDoc,
        language: this.detectLanguage(file)
      });

      if (result.success && !options.dryRun) {
        await fs.writeFile(file, result.output, 'utf-8');
        this.stats.successfulEdits++;
      }

      results.push({ file, success: result.success, confidence: result.confidence });
    }

    return results;
  }

  /**
   * Detect programming language from file extension
   */
  detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.rs': 'rust',
      '.go': 'go',
      '.java': 'java',
      '.c': 'c',
      '.cpp': 'cpp',
      '.cc': 'cpp',
      '.cxx': 'cpp'
    };

    return languageMap[ext] || 'javascript';
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.stats,
      avgLatency: this.stats.totalEdits > 0 ? this.stats.totalLatency / this.stats.totalEdits : 0,
      successRate: this.stats.totalEdits > 0 ? this.stats.successfulEdits / this.stats.totalEdits : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      filesProcessed: 0,
      totalEdits: 0,
      successfulEdits: 0,
      failedEdits: 0,
      totalLatency: 0
    };
  }
}

module.exports = { BoosterUtils };
/**
 * Organized Router-backed model selection strategy.
 *
 * Keeps legacy provider/task inputs working while adding:
 * - task classes
 * - harness-aware routing (Claude, Codex, Pi/local)
 * - privacy / policy / deterministic-first signals
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_TASK_CLASS_CONFIG = require('../../CONFIG/router/task-classes.json');
const DEFAULT_ROUTE_POLICIES = require('../../CONFIG/router/route-policies.json');
const DEFAULT_MODEL_MANIFESTS = require('../../CONFIG/router/model-manifests.json');

class ModelSelector {
  static getRepoRoot() {
    return path.resolve(__dirname, '../..');
  }

  static loadJson(relativePath, fallback) {
    const candidates = [
      path.join(process.cwd(), relativePath),
      path.join(this.getRepoRoot(), relativePath)
    ];

    for (const candidate of candidates) {
      try {
        if (fs.existsSync(candidate)) {
          return JSON.parse(fs.readFileSync(candidate, 'utf8'));
        }
      } catch (error) {
        // Fall through to fallback. Router config should never hard-crash the caller.
      }
    }

    return fallback;
  }

  static loadRouterConfig() {
    if (!this._routerConfig) {
      this._routerConfig = {
        taskClasses: this.loadJson(path.join('CONFIG', 'router', 'task-classes.json'), DEFAULT_TASK_CLASS_CONFIG),
        routePolicies: this.loadJson(path.join('CONFIG', 'router', 'route-policies.json'), DEFAULT_ROUTE_POLICIES),
        modelManifests: this.loadJson(path.join('CONFIG', 'router', 'model-manifests.json'), DEFAULT_MODEL_MANIFESTS)
      };
    }

    return this._routerConfig;
  }

  static normalizeLegacyProvider(provider = 'auto') {
    const providerMap = {
      anthropic: { harness: 'claude-code', provider: 'anthropic' },
      claude: { harness: 'claude-code', provider: 'anthropic' },
      openai: { harness: 'codex', provider: 'openai' },
      codex: { harness: 'codex', provider: 'openai' },
      glm: { harness: 'pi-local', provider: 'ollama' },
      openrouter: { harness: 'claude-code', provider: 'openrouter' },
      ollama: { harness: 'pi-local', provider: 'ollama' },
      local: { harness: 'pi-local', provider: 'ollama' },
      auto: { harness: undefined, provider: undefined }
    };

    return providerMap[provider] || { harness: undefined, provider };
  }

  static normalizeTask(task = 'research') {
    const { taskClasses } = this.loadRouterConfig();
    const aliases = taskClasses.aliases || {};
    return aliases[task] || task;
  }

  static resolveOptions(task, providerOrOptions = 'auto', maybeOptions = {}) {
    if (typeof providerOrOptions === 'string') {
      const normalizedProvider = this.normalizeLegacyProvider(providerOrOptions);
      return {
        taskClass: this.normalizeTask(task),
        rawTask: task,
        priority: maybeOptions.priority || 'default',
        policy: maybeOptions.policy,
        privacy: maybeOptions.privacy,
        harness: maybeOptions.harness || normalizedProvider.harness,
        provider: maybeOptions.provider || normalizedProvider.provider,
        requestedProvider: providerOrOptions
      };
    }

    const options = providerOrOptions || {};
    const normalizedProvider = this.normalizeLegacyProvider(options.provider || 'auto');
    return {
      taskClass: this.normalizeTask(task),
      rawTask: task,
      priority: options.priority || 'default',
      policy: options.policy,
      privacy: options.privacy,
      harness: options.harness || normalizedProvider.harness,
      provider: normalizedProvider.provider,
      requestedProvider: options.provider || 'auto'
    };
  }

  static chooseHarness(profile, resolvedOptions) {
    if (resolvedOptions.privacy === 'local-only' || resolvedOptions.privacy === 'private-first') {
      return 'pi-local';
    }

    if (resolvedOptions.harness && profile.harnesses[resolvedOptions.harness]) {
      return resolvedOptions.harness;
    }

    if (resolvedOptions.provider) {
      const providerMatch = Object.entries(profile.harnesses).find(([, route]) => route.provider === resolvedOptions.provider);
      if (providerMatch) {
        return providerMatch[0];
      }
    }

    return profile.defaultHarness || Object.keys(profile.harnesses)[0];
  }

  static selectRoute(task, providerOrOptions = 'auto', maybeOptions = {}) {
    const { taskClasses, routePolicies, modelManifests } = this.loadRouterConfig();
    const resolvedOptions = this.resolveOptions(task, providerOrOptions, maybeOptions);
    const taskClass = resolvedOptions.taskClass;
    const taskMeta = (taskClasses.classes || {})[taskClass] || { defaultPolicy: routePolicies.defaults.policy };
    const policy = resolvedOptions.policy || taskMeta.defaultPolicy || routePolicies.defaults.policy || 'balanced';
    const taskRoutes = routePolicies.routes[taskClass] || routePolicies.routes.research;
    const profile = taskRoutes[policy] || taskRoutes[routePolicies.defaults.policy] || Object.values(taskRoutes)[0];
    const harness = this.chooseHarness(profile, { ...resolvedOptions, policy, privacy: resolvedOptions.privacy || routePolicies.defaults.privacy || 'standard' });
    const route = profile.harnesses[harness] || Object.values(profile.harnesses)[0];
    const manifest = (modelManifests.models || {})[route.model] || null;

    return {
      taskClass,
      rawTask: resolvedOptions.rawTask,
      policy,
      priority: resolvedOptions.priority,
      privacy: resolvedOptions.privacy || routePolicies.defaults.privacy || 'standard',
      harness,
      provider: route.provider,
      model: route.model,
      deterministicFirst: Boolean(profile.deterministicFirst),
      rationale: route.rationale,
      requestedProvider: resolvedOptions.requestedProvider,
      modelManifest: manifest
    };
  }

  static selectModel(task, provider = 'auto', options = {}) {
    return this.selectRoute(task, provider, options).model;
  }

  static estimateCost(model, tokens) {
    if (!tokens) return 0;

    const usage = {
      input: tokens.input || tokens.prompt_tokens || 0,
      output: tokens.output || tokens.completion_tokens || 0
    };

    const pricing = {
      'claude-opus-4-20250514': { input: 15, output: 75 },
      'claude-sonnet-4': { input: 3, output: 15 },
      'claude-3-5-haiku-20241022': { input: 0.8, output: 4 },
      'qwen3:8b': { input: 0, output: 0 },
      'gemma-4-e4b-it-Q4_K_M': { input: 0, output: 0 }
    };

    const rates = pricing[model] || { input: 1, output: 3 };
    return ((usage.input / 1000000) * rates.input) + ((usage.output / 1000000) * rates.output);
  }

  static getRecommendations(task, options = {}) {
    return {
      taskClass: this.normalizeTask(task),
      defaultRoute: this.selectRoute(task, options),
      byPolicy: {
        balanced: this.selectRoute(task, { ...options, policy: 'balanced' }),
        'local-first': this.selectRoute(task, { ...options, policy: 'local-first' }),
        quality: this.selectRoute(task, { ...options, policy: 'quality' }),
        'private-first': this.selectRoute(task, { ...options, policy: 'private-first', privacy: 'local-only' }),
        'budget-first': this.selectRoute(task, { ...options, policy: 'budget-first' })
      },
      byHarness: {
        'claude-code': this.selectRoute(task, { ...options, harness: 'claude-code' }),
        codex: this.selectRoute(task, { ...options, harness: 'codex' }),
        'pi-local': this.selectRoute(task, { ...options, harness: 'pi-local', privacy: options.privacy || 'local-only' })
      }
    };
  }

  static getSupportedTaskClasses() {
    const { taskClasses } = this.loadRouterConfig();
    return Object.keys(taskClasses.classes || {});
  }
}

module.exports = { ModelSelector };

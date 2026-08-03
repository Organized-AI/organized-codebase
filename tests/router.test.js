const assert = require('assert');
const { ModelSelector } = require('../src/strategies/ModelSelector');

const localSummary = ModelSelector.selectRoute('summarize', { policy: 'local-first' });
assert.strictEqual(localSummary.harness, 'pi-local');
assert.strictEqual(localSummary.model, 'qwen3:8b');

const defaultCodegen = ModelSelector.selectRoute('code-generation', 'auto');
assert.strictEqual(defaultCodegen.taskClass, 'codegen');
assert.strictEqual(defaultCodegen.harness, 'codex');
assert.strictEqual(defaultCodegen.model, 'gpt-5-codex');

const privatePlan = ModelSelector.selectRoute('plan', { privacy: 'local-only' });
assert.strictEqual(privatePlan.harness, 'pi-local');
assert.strictEqual(privatePlan.provider, 'ollama');

const verifyRoute = ModelSelector.selectRoute('verify', { policy: 'balanced' });
assert.strictEqual(verifyRoute.deterministicFirst, true);

const recommendations = ModelSelector.getRecommendations('review');
assert.ok(recommendations.byHarness.codex.model);
assert.ok(recommendations.byPolicy.quality.model);

console.log('router.test.js passed');

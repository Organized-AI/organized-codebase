/**
 * Benchmark Tests
 * Compare Hybrid Agent performance across providers and operations
 */

const { HybridAgent } = require('../src/agents/HybridAgent');
const { BoosterUtils } = require('../src/utils/booster-utils');
const { performance } = require('perf_hooks');

// Test cases for benchmarking
const testCases = [
  {
    name: 'Add TypeScript types',
    code: 'function add(a, b) { return a + b; }',
    instruction: 'Add TypeScript type annotations',
    language: 'typescript'
  },
  {
    name: 'Add error handling',
    code: 'const data = JSON.parse(input);',
    instruction: 'Wrap in try-catch with error logging',
    language: 'javascript'
  },
  {
    name: 'Modernize syntax',
    code: 'var x = 1; var y = 2; var sum = x + y;',
    instruction: 'Use const/let instead of var',
    language: 'javascript'
  },
  {
    name: 'Add async/await',
    code: 'function fetchData() { return fetch(url).then(r => r.json()); }',
    instruction: 'Convert to async/await',
    language: 'javascript'
  },
  {
    name: 'Add JSDoc',
    code: 'function calculate(x, y) { return x * y; }',
    instruction: 'Add JSDoc documentation',
    language: 'javascript'
  }
];

async function runBenchmark() {
  console.log('🧪 Running Hybrid Agent Benchmarks\n');
  console.log('='.repeat(80));

  // Test with available provider (GLM preferred, fallback to others)
  let provider = 'auto';
  let agent;

  try {
    agent = new HybridAgent({ provider });
    console.log(`\n✅ Using provider: ${agent.provider}`);
    console.log(`📋 Model: ${agent.defaultModel}`);
  } catch (error) {
    console.error(`\n❌ No LLM provider configured: ${error.message}`);
    console.log('\n⚠️  Skipping LLM benchmarks. Set GLM_API_KEY, OPENROUTER_API_KEY, or ANTHROPIC_API_KEY to run full benchmarks.');
    console.log('\n🔄 Running Agent Booster-only benchmarks...\n');
    await runBoosterOnlyBenchmarks();
    return;
  }

  console.log('='.repeat(80));
  console.log('\n');

  const results = [];

  for (const test of testCases) {
    console.log(`Testing: ${test.name}`);
    console.log('-'.repeat(80));

    const start = performance.now();

    try {
      const result = await agent.editCode(
        test.code,
        test.instruction,
        test.language
      );
      const end = performance.now();

      const totalTime = (end - start).toFixed(2);

      console.log(`  ✅ Success: ${result.success}`);
      console.log(`  🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`  ⚡ LLM Latency: ${result.latency.llm}ms`);
      console.log(`  ⚡ Booster Latency: ${result.latency.booster}ms`);
      console.log(`  ⏱️  Total Time: ${totalTime}ms`);
      console.log(`  💰 Cost: $${result.cost.toFixed(6)}`);
      console.log(`  🚀 Speedup: ${(result.latency.llm / result.latency.booster).toFixed(1)}x`);
      console.log(`  🔧 Strategy: ${result.strategy}`);

      results.push({
        test: test.name,
        success: result.success,
        confidence: result.confidence,
        llmLatency: result.latency.llm,
        boosterLatency: result.latency.booster,
        totalTime: parseFloat(totalTime),
        cost: result.cost,
        speedup: result.latency.llm / result.latency.booster
      });
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({
        test: test.name,
        success: false,
        error: error.message
      });
    }

    console.log('');
  }

  // Summary statistics
  console.log('='.repeat(80));
  console.log('\n📊 FINAL STATISTICS\n');
  console.log('='.repeat(80));

  const stats = agent.getStats();
  const successfulResults = results.filter(r => r.success);

  if (successfulResults.length > 0) {
    const avgLLMLatency = successfulResults.reduce((sum, r) => sum + r.llmLatency, 0) / successfulResults.length;
    const avgBoosterLatency = successfulResults.reduce((sum, r) => sum + r.boosterLatency, 0) / successfulResults.length;
    const avgTotalTime = successfulResults.reduce((sum, r) => sum + r.totalTime, 0) / successfulResults.length;
    const avgCost = successfulResults.reduce((sum, r) => sum + r.cost, 0) / successfulResults.length;
    const avgSpeedup = successfulResults.reduce((sum, r) => sum + r.speedup, 0) / successfulResults.length;

    console.log(`\nProvider: ${stats.provider}`);
    console.log(`Total Tests: ${testCases.length}`);
    console.log(`Successful: ${successfulResults.length}`);
    console.log(`Failed: ${results.length - successfulResults.length}`);
    console.log(`\nAverage Performance:`);
    console.log(`  LLM Latency: ${avgLLMLatency.toFixed(2)}ms`);
    console.log(`  Booster Latency: ${avgBoosterLatency.toFixed(2)}ms`);
    console.log(`  Total Time: ${avgTotalTime.toFixed(2)}ms`);
    console.log(`  Cost per Edit: $${avgCost.toFixed(6)}`);
    console.log(`  Average Speedup: ${avgSpeedup.toFixed(1)}x`);
    console.log(`\nCumulative Stats:`);
    console.log(`  Total LLM Calls: ${stats.llmCalls}`);
    console.log(`  Total Tokens: ${stats.llmTokens}`);
    console.log(`  Total Cost: $${stats.llmCost.toFixed(4)}`);
    console.log(`  Total Booster Edits: ${stats.boosterEdits}`);
    console.log(`  Overall Speedup: ${stats.speedup.toFixed(1)}x`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Benchmark Complete!\n');
}

async function runBoosterOnlyBenchmarks() {
  console.log('⚡ Agent Booster Standalone Benchmarks\n');
  console.log('='.repeat(80));

  const booster = new BoosterUtils();
  const results = [];

  for (const test of testCases) {
    console.log(`Testing: ${test.name}`);
    console.log('-'.repeat(80));

    const start = performance.now();

    try {
      // For Booster-only, we need to provide the transformed code
      // This simulates what the LLM would provide
      let transform = test.code;

      // Simple transformations
      switch (test.name) {
        case 'Add TypeScript types':
          transform = 'function add(a: number, b: number): number { return a + b; }';
          break;
        case 'Modernize syntax':
          transform = test.code.replace(/var /g, 'const ');
          break;
        case 'Add JSDoc':
          transform = '/** Calculate product */\nfunction calculate(x, y) { return x * y; }';
          break;
      }

      const result = await booster.booster.apply({
        code: test.code,
        edit: transform,
        language: test.language
      });

      const end = performance.now();
      const latency = (end - start).toFixed(2);

      console.log(`  ✅ Success: ${result.success}`);
      console.log(`  🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`  ⚡ Latency: ${latency}ms`);
      console.log(`  🔧 Strategy: ${result.strategy}`);

      results.push({
        test: test.name,
        success: result.success,
        latency: parseFloat(latency),
        confidence: result.confidence
      });
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }

    console.log('');
  }

  const successfulResults = results.filter(r => r.success);
  if (successfulResults.length > 0) {
    const avgLatency = successfulResults.reduce((sum, r) => sum + r.latency, 0) / successfulResults.length;

    console.log('='.repeat(80));
    console.log('\n📊 Booster Performance Summary\n');
    console.log(`Tests Run: ${results.length}`);
    console.log(`Successful: ${successfulResults.length}`);
    console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`);
    console.log(`\n✅ All operations completed in ~${avgLatency.toFixed(0)}ms average`);
    console.log('💰 Total Cost: $0.00 (100% local processing)');
  }

  console.log('\n' + '='.repeat(80));
}

// Run benchmarks
runBenchmark().catch(console.error);

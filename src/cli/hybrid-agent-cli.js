#!/usr/bin/env node

/**
 * Hybrid Agent CLI
 * Command-line interface for the hybrid agent system
 */

const { Command } = require('commander');
const { HybridAgent } = require('../agents/HybridAgent');
const { BoosterUtils } = require('../utils/booster-utils');
const { ModelSelector } = require('../strategies/ModelSelector');
const fs = require('fs').promises;
const path = require('path');

const program = new Command();

program
  .name('hybrid-agent')
  .description('Hybrid AI Agent CLI - GLM/OpenRouter + Agent Booster')
  .version('1.0.0');

// Edit command
program
  .command('edit')
  .description('Edit a code file with AI assistance')
  .argument('<file>', 'File to edit')
  .argument('<instruction>', 'What to change')
  .option('-m, --model <model>', 'LLM model to use')
  .option('-p, --provider <provider>', 'LLM provider (glm/openrouter/anthropic/auto)', 'auto')
  .option('-l, --language <lang>', 'Programming language')
  .option('-o, --output <file>', 'Output file (default: overwrite input)')
  .option('--dry-run', 'Show changes without writing')
  .action(async (file, instruction, options) => {
    try {
      const agent = new HybridAgent({
        defaultModel: options.model,
        provider: options.provider
      });

      const code = await fs.readFile(file, 'utf-8');
      const language = options.language || path.extname(file).slice(1);

      console.log(`📝 Editing ${file} using ${agent.provider}...`);

      const result = await agent.editCode(code, instruction, language);

      if (result.success) {
        const outputFile = options.output || file;

        if (!options.dryRun) {
          await fs.writeFile(outputFile, result.output);
          console.log(`✅ Success! Saved to: ${outputFile}`);
        } else {
          console.log(`✅ Success! (Dry run - not saved)`);
          console.log('\nPreview:');
          console.log(result.output.slice(0, 500) + '...');
        }

        console.log(`🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`⚡ Latency: LLM ${result.latency.llm}ms, Booster ${result.latency.booster}ms`);
        console.log(`💰 Cost: $${result.cost.toFixed(6)}`);
        console.log(`🔧 Strategy: ${result.strategy}`);
      } else {
        console.error('❌ Edit failed');
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Analyze command
program
  .command('analyze')
  .description('Analyze code with AI')
  .argument('<file>', 'File to analyze')
  .argument('<question>', 'Question about the code')
  .option('-m, --model <model>', 'LLM model to use')
  .option('-p, --provider <provider>', 'LLM provider (glm/openrouter/anthropic/auto)', 'auto')
  .action(async (file, question, options) => {
    try {
      const agent = new HybridAgent({
        defaultModel: options.model,
        provider: options.provider
      });

      const code = await fs.readFile(file, 'utf-8');

      console.log(`🔍 Analyzing ${file} using ${agent.provider}...`);

      const result = await agent.analyzeCode(code, question, options);

      console.log('\n📊 Analysis:');
      console.log(result.analysis);
      console.log(`\n⚡ Latency: ${result.latency}ms`);
      console.log(`🎯 Model: ${result.model}`);
      console.log(`💰 Cost: $${result.cost.toFixed(6)}`);
      console.log(`📈 Tokens: ${result.usage.total_tokens}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Refactor command
program
  .command('refactor')
  .description('Multi-step refactoring with AI')
  .argument('<file>', 'File to refactor')
  .argument('<goal>', 'Refactoring goal')
  .option('-m, --model <model>', 'LLM model to use')
  .option('-p, --provider <provider>', 'LLM provider (glm/openrouter/anthropic/auto)', 'auto')
  .option('-l, --language <lang>', 'Programming language')
  .option('-s, --max-steps <num>', 'Maximum steps', '5')
  .option('-o, --output <file>', 'Output file (default: overwrite input)')
  .action(async (file, goal, options) => {
    try {
      const agent = new HybridAgent({
        defaultModel: options.model,
        provider: options.provider
      });

      const code = await fs.readFile(file, 'utf-8');
      const language = options.language || path.extname(file).slice(1);

      console.log(`🔄 Refactoring ${file} using ${agent.provider}...`);

      const result = await agent.refactor(code, goal, language, {
        maxSteps: parseInt(options.maxSteps)
      });

      console.log('\n📋 Refactoring Plan:');
      console.log(result.plan);

      console.log('\n📝 Steps Executed:');
      result.steps.forEach((step, i) => {
        const status = step.success ? '✅' : '❌';
        console.log(`${status} ${i + 1}. ${step.description}`);
        if (step.confidence) {
          console.log(`   Confidence: ${(step.confidence * 100).toFixed(1)}%`);
        }
      });

      if (result.successful) {
        const outputFile = options.output || file;
        await fs.writeFile(outputFile, result.finalCode);
        console.log(`\n💾 Saved to: ${outputFile}`);
      } else {
        console.log('\n⚠️  Refactoring incomplete');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Batch edit command
program
  .command('batch')
  .description('Batch edit multiple files')
  .argument('<pattern>', 'File pattern (glob)')
  .argument('<instruction>', 'What to change')
  .option('-p, --provider <provider>', 'LLM provider (glm/openrouter/anthropic/auto)', 'auto')
  .option('-m, --model <model>', 'LLM model to use')
  .option('--dry-run', 'Show changes without writing')
  .action(async (pattern, instruction, options) => {
    try {
      const glob = require('glob');
      const { promisify } = require('util');
      const globAsync = promisify(glob);

      const files = await globAsync(pattern);

      console.log(`Found ${files.length} files matching pattern`);

      const agent = new HybridAgent({
        defaultModel: options.model,
        provider: options.provider
      });

      const fileData = await Promise.all(
        files.map(async (filePath) => ({
          path: filePath,
          code: await fs.readFile(filePath, 'utf-8'),
          language: path.extname(filePath).slice(1)
        }))
      );

      console.log(`📦 Processing ${fileData.length} files...`);

      const result = await agent.batchEdit(fileData, instruction, options);

      console.log('\n📋 Plan:');
      console.log(result.plan);

      console.log('\n📊 Results:');
      console.log(`✅ Successful: ${result.summary.successful}`);
      console.log(`❌ Failed: ${result.summary.failed}`);

      if (!options.dryRun) {
        for (const fileResult of result.results) {
          if (fileResult.success) {
            await fs.writeFile(fileResult.path, fileResult.output);
          }
        }
        console.log('\n💾 Files updated');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Booster-only commands (no LLM)
program
  .command('booster-transform')
  .description('Fast transformation using Agent Booster only (no LLM)')
  .argument('<pattern>', 'File pattern (glob)')
  .argument('<transform>', 'Transformation to apply')
  .option('--dry-run', 'Show changes without writing')
  .action(async (pattern, transform, options) => {
    try {
      const booster = new BoosterUtils();

      console.log(`⚡ Applying transformation with Agent Booster...`);

      const result = await booster.transformFiles(pattern, transform, options);

      console.log('\n📊 Results:');
      console.log(`✅ Successful: ${result.successful}`);
      console.log(`❌ Failed: ${result.failed}`);

      const stats = booster.getStats();
      console.log(`\n⏱️  Avg Latency: ${stats.avgLatency.toFixed(2)}ms`);
      console.log(`📈 Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('booster-typescript')
  .description('Add TypeScript types using Agent Booster')
  .argument('<pattern>', 'File pattern (glob)')
  .option('--dry-run', 'Show changes without writing')
  .action(async (pattern, options) => {
    try {
      const booster = new BoosterUtils();

      console.log(`⚡ Adding TypeScript types...`);

      const results = await booster.addTypeScriptTypes(pattern, options);

      const successful = results.filter(r => r.success).length;
      console.log(`\n✅ Converted ${successful}/${results.length} files`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('booster-modernize')
  .description('Modernize JavaScript syntax using Agent Booster')
  .argument('<pattern>', 'File pattern (glob)')
  .option('--dry-run', 'Show changes without writing')
  .action(async (pattern, options) => {
    try {
      const booster = new BoosterUtils();

      console.log(`⚡ Modernizing JavaScript syntax...`);

      const results = await booster.modernizeSyntax(pattern, options);

      const successful = results.filter(r => r.success).length;
      console.log(`\n✅ Modernized ${successful}/${results.length} files`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Stats command
program
  .command('stats')
  .description('Show usage statistics')
  .option('-p, --provider <provider>', 'LLM provider (glm/openrouter/anthropic/auto)', 'auto')
  .action((options) => {
    try {
      const agent = new HybridAgent({ provider: options.provider });
      const stats = agent.getStats();

      console.log('\n📊 Usage Statistics:');
      console.log(`Provider: ${stats.provider}`);
      console.log(`LLM Calls: ${stats.llmCalls}`);
      console.log(`LLM Tokens: ${stats.llmTokens}`);
      console.log(`LLM Cost: $${stats.llmCost.toFixed(4)}`);
      console.log(`Booster Edits: ${stats.boosterEdits}`);
      console.log(`\nAverage Latency:`);
      console.log(`  LLM: ${stats.avgLatency.llm.toFixed(2)}ms`);
      console.log(`  Booster: ${stats.avgLatency.booster.toFixed(2)}ms`);
      console.log(`\n⚡ Speedup: ${stats.speedup.toFixed(1)}x`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Models command
program
  .command('models')
  .description('List available models')
  .option('-p, --provider <provider>', 'LLM provider (glm/openrouter/anthropic)', 'glm')
  .option('-t, --task <task>', 'Task type for recommendations')
  .action((options) => {
    try {
      if (options.task) {
        const recommendations = ModelSelector.getRecommendations(options.task);
        console.log(`\n📊 Model Recommendations for: ${options.task}`);
        console.log(JSON.stringify(recommendations, null, 2));
      } else {
        const agent = new HybridAgent({ provider: options.provider });
        const models = agent.llm.getModels();

        console.log(`\n📋 Available Models (${options.provider}):\n`);
        models.forEach(model => {
          console.log(`${model.id}`);
          console.log(`  ${model.description}`);
          console.log(`  Context: ${model.contextWindow.toLocaleString()} tokens`);
          if (model.pricing) {
            console.log(`  Pricing: $${model.pricing.input}/$${model.pricing.output} per 1M tokens`);
          }
          console.log('');
        });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();

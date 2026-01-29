#!/usr/bin/env node

/**
 * create-organized-codebase CLI
 *
 * Interactive installer for Organized Codebase with Boris methodology.
 *
 * Usage:
 *   npx create-organized-codebase          # Interactive mode
 *   npx create-organized-codebase --help   # Show help
 */

import { Command } from 'commander';
import ora from 'ora';
import { detectProject } from './detector.js';
import { runWizard, confirmInstall } from './wizard/index.js';
import { install } from './installers/index.js';
import {
  showBanner,
  showDetectedContext,
  showInstallSummary,
  showResult,
  showError,
} from './utils/logger.js';
import type { InstallConfig, CommandPack, InstallScope, VerificationDepth } from './types.js';

const VERSION = '0.1.0';

const program = new Command();

program
  .name('create-organized-codebase')
  .description('Set up Organized Codebase with Boris methodology for Claude Code projects')
  .version(VERSION)
  .option('--local', 'Install to current project only')
  .option('--global', 'Install to ~/.claude/ (all projects)')
  .option('--both', 'Install to both local and global')
  .option('--with-boris', 'Include Boris methodology commands')
  .option('--with-oc', 'Include Organized Codebase workflow commands')
  .option('--with-session', 'Include session management commands')
  .option('--minimal', 'Skip optional features')
  .option('--dry-run', 'Show what would be installed without installing')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (options) => {
    try {
      await main(options);
    } catch (error) {
      showError(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();

async function main(options: {
  local?: boolean;
  global?: boolean;
  both?: boolean;
  withBoris?: boolean;
  withOc?: boolean;
  withSession?: boolean;
  minimal?: boolean;
  dryRun?: boolean;
  yes?: boolean;
}): Promise<void> {
  // Show banner
  showBanner();

  // Detect project context
  const spinner = ora('Analyzing project...').start();
  const cwd = process.cwd();
  const context = await detectProject(cwd);
  spinner.succeed('Project analyzed');

  // Show detected context
  showDetectedContext(context);

  let config: InstallConfig;

  // Check if running in non-interactive mode
  const isNonInteractive =
    options.local || options.global || options.both || options.minimal;

  if (isNonInteractive) {
    // Build config from CLI options
    const scope: InstallScope = options.both
      ? 'both'
      : options.global
      ? 'global'
      : 'local';

    const commandPacks: CommandPack[] = [];
    if (options.withBoris !== false) commandPacks.push('boris');
    if (options.withOc !== false) commandPacks.push('oc');
    if (options.withSession !== false) commandPacks.push('session');
    if (commandPacks.length === 0) {
      // Default to all if none specified
      commandPacks.push('boris', 'oc', 'session');
    }

    config = {
      scope,
      commandPacks,
      verificationDepth: options.minimal ? 'quick' : 'standard',
      initializeCLAUDEmd: !options.minimal && !context.hasCLAUDEmd,
      preserveExisting: true,
      projectName: context.projectName,
      techStack: context.techStack,
    };
  } else {
    // Run interactive wizard
    config = await runWizard(context);
  }

  // Show summary
  showInstallSummary(config);

  // Dry run mode
  if (options.dryRun) {
    console.log('Dry run mode - no files will be created.');
    console.log('\nWould install:');
    config.commandPacks.forEach((pack) => {
      console.log(`  • ${pack} commands`);
    });
    if (config.initializeCLAUDEmd) {
      console.log('  • CLAUDE.md');
    }
    console.log(`  • settings.json`);
    return;
  }

  // Confirm installation
  if (!options.yes) {
    const confirmed = await confirmInstall(config);
    if (!confirmed) {
      console.log('\nInstallation cancelled.');
      return;
    }
  }

  // Install
  const installSpinner = ora('Installing...').start();
  const result = await install(cwd, config);
  installSpinner.stop();

  // Show result
  showResult(result, config);

  if (!result.success) {
    process.exit(1);
  }
}

/**
 * Logger Utilities
 *
 * Styled console output for the CLI
 */

import chalk from 'chalk';
import type { ProjectContext, InstallConfig, InstallResult } from '../types.js';

const VERSION = '0.1.0';

/**
 * ASCII Art banner - styled after GSD with filled block characters
 * Represents human-AI collaboration (Organized AI brand)
 */
function getBannerArt(): string {
  // Golden yellow to match Organized AI brand (#FFD54F)
  const y = chalk.hex('#FFD54F');

  // "ORGANIZED AI" in block letters
  return [
    '',
    `   ${y('█▀█')} ${y('█▀▀█')} ${y('█▀▀█')} ${y('█▀▀█')} ${y('█▀▀▄')} ${y('▀█▀')} ${y('▀▀█')} ${y('█▀▀')} ${y('█▀▀▄')}   ${y('█▀▀█')} ${y('▀█▀')}`,
    `   ${y('█ █')} ${y('█▄▄▀')} ${y('█ ▄▄')} ${y('█▄▄█')} ${y('█  █')}  ${y('█')}  ${y('▄▀ ')} ${y('█▀▀')} ${y('█  █')}   ${y('█▄▄█')}  ${y('█')} `,
    `   ${y('▀▀▀')} ${y('▀ ▀▀')} ${y('▀▀▀▀')} ${y('▀  ▀')} ${y('▀  ▀')} ${y('▀▀▀')} ${y('▀▀▀')} ${y('▀▀▀')} ${y('▀▀▀ ')}   ${y('▀  ▀')} ${y('▀▀▀')}`,
    '',
  ].join('\n');
}

// Golden yellow to match brand
const BRAND_YELLOW = chalk.hex('#FFD54F');

/**
 * Display the welcome banner with ASCII art
 */
export function showBanner(): void {
  console.log(getBannerArt());
  console.log(`${BRAND_YELLOW.bold('Organized AI')} ${chalk.gray(`v${VERSION}`)}`);
  console.log(chalk.dim('Context engineering for Claude Code.'));
  console.log();
}

/**
 * Display a progress step with checkmark
 */
export function showProgress(message: string, status: 'pending' | 'done' | 'skip' = 'done'): void {
  const icons = {
    pending: chalk.gray('○'),
    done: chalk.green('✓'),
    skip: chalk.yellow('○'),
  };
  console.log(`${icons[status]} ${status === 'done' ? chalk.white(message) : chalk.gray(message)}`);
}

/**
 * Display the "Done!" completion message with next steps
 */
export function showDone(nextCommand: string): void {
  console.log();
  console.log(`${chalk.green.bold('Done!')} Run ${chalk.cyan(nextCommand)} to get started.`);
  console.log();
}

/**
 * Display detected project context
 */
export function showDetectedContext(context: ProjectContext): void {
  const parts: string[] = [];

  // Tech stack
  if (context.techStack !== 'unknown') {
    const stackLabels: Record<string, string> = {
      node: 'Node.js',
      python: 'Python',
      ruby: 'Ruby',
      go: 'Go',
      rust: 'Rust',
    };
    parts.push(stackLabels[context.techStack] || context.techStack);
  }

  // Git
  if (context.isGitRepo) {
    parts.push('Git repository');
  }

  // Size
  parts.push(`${context.projectSize} project`);

  // Existing .claude
  if (context.hasClaudeDir) {
    parts.push(chalk.yellow('Existing .claude/'));
  }

  console.log(chalk.dim('Detected: ') + parts.join(' • '));
  console.log(chalk.dim(`Files: ${context.projectSize === 'small' ? '<50' : context.projectSize === 'medium' ? '50-500' : '500+'}`));
  console.log();
}

/**
 * Display installation summary
 */
export function showInstallSummary(config: InstallConfig): void {
  console.log();
  console.log(chalk.bold('Installation Summary:'));
  console.log(chalk.dim('─'.repeat(40)));
  console.log(`  Scope:      ${config.scope}`);
  console.log(`  Commands:   ${config.commandPacks.join(', ')}`);
  console.log(`  Depth:      ${config.verificationDepth}`);
  console.log(`  CLAUDE.md:  ${config.initializeCLAUDEmd ? 'Yes' : 'No'}`);
  console.log(chalk.dim('─'.repeat(40)));
  console.log();
}

/**
 * Display installation result - GSD-style with progress checkmarks
 */
export function showResult(result: InstallResult, _config: InstallConfig): void {
  console.log();

  if (result.success) {
    // Show installed items with checkmarks (GSD style)
    result.filesCreated.forEach((file) => {
      console.log(`${chalk.green('✓')} Installed ${chalk.white(file)}`);
    });

    // Show skipped items
    result.filesSkipped.forEach((file) => {
      console.log(`${chalk.yellow('○')} Skipped ${chalk.gray(file)} ${chalk.dim('(exists)')}`);
    });

    // Done message with next command
    console.log();
    console.log(`${chalk.green.bold('Done!')} Run ${chalk.cyan('/status')} to get started.`);
    console.log();
  } else {
    // Error display
    result.errors.forEach((error) => {
      console.log(`${chalk.red('✗')} ${chalk.red(error)}`);
    });

    if (result.filesCreated.length > 0) {
      console.log();
      console.log(chalk.yellow('Partially installed:'));
      result.filesCreated.forEach((file) => {
        console.log(`  ${chalk.yellow('•')} ${file}`);
      });
    }

    console.log();
    console.log(chalk.red.bold('Installation failed.'));
    console.log();
  }
}

/**
 * Display an error message
 */
export function showError(message: string): void {
  console.error(chalk.red(`\n❌ Error: ${message}\n`));
}

/**
 * Display an info message
 */
export function showInfo(message: string): void {
  console.log(chalk.cyan(`ℹ ${message}`));
}

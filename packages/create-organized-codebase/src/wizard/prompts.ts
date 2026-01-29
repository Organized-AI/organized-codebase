/**
 * Wizard Prompts
 *
 * Adaptive question flow based on detected project context.
 */

import inquirer from 'inquirer';
import type {
  ProjectContext,
  InstallConfig,
  InstallScope,
  CommandPack,
  VerificationDepth,
} from '../types.js';

/**
 * Run the interactive wizard and collect user preferences
 */
export async function runWizard(context: ProjectContext): Promise<InstallConfig> {
  const answers = await inquirer.prompt([
    // Question 1: Installation scope
    {
      type: 'list',
      name: 'scope',
      message: 'Installation scope',
      choices: [
        {
          name: 'Local (this project only) - Recommended for team projects',
          value: 'local',
        },
        {
          name: 'Global (~/.claude/) - Available in all projects',
          value: 'global',
        },
        {
          name: 'Both - Global defaults + local overrides',
          value: 'both',
        },
      ],
      default: 'local',
    },

    // Question 2: Command packs
    {
      type: 'checkbox',
      name: 'commandPacks',
      message: 'Which command packs to install?',
      choices: [
        {
          name: 'Boris Methodology (/verify, /commit, /status, /review)',
          value: 'boris',
          checked: true,
        },
        {
          name: 'OC Workflow (/oc:new-project, /oc:progress, /oc:discuss)',
          value: 'oc',
          checked: true,
        },
        {
          name: 'Session Management (/session:start, /session:end)',
          value: 'session',
          checked: true,
        },
        {
          name: 'Long Runner (multi-session orchestration)',
          value: 'long-runner',
          checked: false,
        },
      ],
      validate: (input: string[]) => {
        if (input.length === 0) {
          return 'Please select at least one command pack';
        }
        return true;
      },
    },

    // Question 3: Verification depth (only for medium/large projects)
    {
      type: 'list',
      name: 'verificationDepth',
      message: `Verification depth (project size: ${context.projectSize})`,
      choices: [
        {
          name: 'Standard - Type checks, linting, tests',
          value: 'standard',
        },
        {
          name: 'Quick - Basic lint + type check',
          value: 'quick',
        },
        {
          name: 'Comprehensive - Full architecture review',
          value: 'comprehensive',
        },
      ],
      default: context.projectSize === 'large' ? 'comprehensive' : 'standard',
      when: () => context.projectSize !== 'small',
    },

    // Question 4: Initialize CLAUDE.md (only if it doesn't exist)
    {
      type: 'confirm',
      name: 'initializeCLAUDEmd',
      message: context.packageJson
        ? 'Initialize CLAUDE.md with tech stack pre-filled from package.json?'
        : 'Initialize CLAUDE.md?',
      default: true,
      when: () => !context.hasCLAUDEmd,
    },

    // Question 5: Preserve existing files (only if .claude/ exists)
    {
      type: 'confirm',
      name: 'preserveExisting',
      message: `Found existing .claude/ directory with ${context.existingCommands.length} commands. Preserve existing files?`,
      default: true,
      when: () => context.hasClaudeDir,
    },
  ]);

  // Apply defaults for skipped questions
  return {
    scope: answers.scope as InstallScope,
    commandPacks: answers.commandPacks as CommandPack[],
    verificationDepth: (answers.verificationDepth ?? 'standard') as VerificationDepth,
    initializeCLAUDEmd: answers.initializeCLAUDEmd ?? context.hasCLAUDEmd ? false : true,
    preserveExisting: answers.preserveExisting ?? false,
    projectName: context.projectName,
    techStack: context.techStack,
  };
}

/**
 * Prompt for confirmation before installation
 */
export async function confirmInstall(config: InstallConfig): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Proceed with installation?',
      default: true,
    },
  ]);
  return confirmed;
}

/**
 * Core Installer
 *
 * Handles installing files to local (.claude/) or global (~/.claude/) directories.
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import type {
  InstallConfig,
  InstallResult,
  TemplateContext,
  CommandPack,
} from '../types.js';
import {
  getTemplatesDir,
  copyTemplate,
  getTemplateFiles,
  renderTemplateFile,
} from './templates.js';

// Package version (will be injected at build time)
const VERSION = '0.1.0';

/**
 * Get the target directory for installation
 */
function getTargetDir(scope: 'local' | 'global', cwd: string): string {
  if (scope === 'global') {
    return path.join(os.homedir(), '.claude');
  }
  return path.join(cwd, '.claude');
}

/**
 * Create template context from install config
 */
function createTemplateContext(config: InstallConfig): TemplateContext {
  return {
    projectName: config.projectName,
    techStack: config.techStack,
    timestamp: new Date().toISOString().split('T')[0],
    version: VERSION,
    verificationDepth: config.verificationDepth,
  };
}

/**
 * Get command directories to install based on selected packs
 */
function getCommandDirs(packs: CommandPack[]): string[] {
  const dirs: string[] = [];

  if (packs.includes('boris')) {
    dirs.push('commands/boris');
  }
  if (packs.includes('oc')) {
    dirs.push('commands/oc');
  }
  if (packs.includes('session')) {
    dirs.push('commands/session');
  }

  return dirs;
}

/**
 * Install commands to target directory
 */
async function installCommands(
  targetDir: string,
  packs: CommandPack[],
  preserveExisting: boolean
): Promise<{ created: string[]; skipped: string[] }> {
  const created: string[] = [];
  const skipped: string[] = [];
  const templatesDir = getTemplatesDir();

  const commandDirs = getCommandDirs(packs);

  for (const commandDir of commandDirs) {
    const files = await getTemplateFiles(commandDir);

    for (const file of files) {
      const srcPath = path.join(templatesDir, commandDir, file);
      const destPath = path.join(targetDir, commandDir, file);

      // Check if file exists and we should preserve
      if (preserveExisting && (await fs.pathExists(destPath))) {
        skipped.push(path.join(commandDir, file));
        continue;
      }

      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(srcPath, destPath);
      created.push(path.join(commandDir, file));
    }
  }

  return { created, skipped };
}

/**
 * Install config files (settings.json)
 */
async function installConfig(
  targetDir: string,
  preserveExisting: boolean
): Promise<{ created: string[]; skipped: string[] }> {
  const created: string[] = [];
  const skipped: string[] = [];
  const templatesDir = getTemplatesDir();

  const settingsPath = path.join(targetDir, 'settings.json');
  const templatePath = path.join(templatesDir, 'config', 'settings.json');

  if (preserveExisting && (await fs.pathExists(settingsPath))) {
    skipped.push('settings.json');
  } else {
    await fs.ensureDir(targetDir);
    await fs.copy(templatePath, settingsPath);
    created.push('settings.json');
  }

  return { created, skipped };
}

/**
 * Install CLAUDE.md to project root
 */
async function installCLAUDEmd(
  cwd: string,
  config: InstallConfig
): Promise<{ created: string[]; skipped: string[] }> {
  const created: string[] = [];
  const skipped: string[] = [];

  const claudeMdPath = path.join(cwd, 'CLAUDE.md');

  if (await fs.pathExists(claudeMdPath)) {
    skipped.push('CLAUDE.md');
  } else {
    const context = createTemplateContext(config);
    const content = await renderTemplateFile('config/CLAUDE.md.template', context);
    await fs.outputFile(claudeMdPath, content);
    created.push('CLAUDE.md');
  }

  return { created, skipped };
}

/**
 * Install to a single scope (local or global)
 */
async function installToScope(
  scope: 'local' | 'global',
  cwd: string,
  config: InstallConfig
): Promise<InstallResult> {
  const targetDir = getTargetDir(scope, cwd);
  const filesCreated: string[] = [];
  const filesSkipped: string[] = [];
  const errors: string[] = [];

  try {
    // Install commands
    const commands = await installCommands(
      targetDir,
      config.commandPacks,
      config.preserveExisting
    );
    filesCreated.push(...commands.created.map((f) => `.claude/${f}`));
    filesSkipped.push(...commands.skipped.map((f) => `.claude/${f}`));

    // Install config
    const configResult = await installConfig(targetDir, config.preserveExisting);
    filesCreated.push(...configResult.created.map((f) => `.claude/${f}`));
    filesSkipped.push(...configResult.skipped.map((f) => `.claude/${f}`));

    // Install CLAUDE.md (only for local scope)
    if (scope === 'local' && config.initializeCLAUDEmd) {
      const claudeResult = await installCLAUDEmd(cwd, config);
      filesCreated.push(...claudeResult.created);
      filesSkipped.push(...claudeResult.skipped);
    }

    return {
      success: true,
      filesCreated,
      filesSkipped,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      filesCreated,
      filesSkipped,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Main installation function
 */
export async function install(cwd: string, config: InstallConfig): Promise<InstallResult> {
  const allCreated: string[] = [];
  const allSkipped: string[] = [];
  const allErrors: string[] = [];

  if (config.scope === 'local' || config.scope === 'both') {
    const result = await installToScope('local', cwd, config);
    allCreated.push(...result.filesCreated);
    allSkipped.push(...result.filesSkipped);
    allErrors.push(...result.errors);
  }

  if (config.scope === 'global' || config.scope === 'both') {
    const result = await installToScope('global', cwd, {
      ...config,
      initializeCLAUDEmd: false, // Never install CLAUDE.md globally
    });
    allCreated.push(...result.filesCreated.map((f) => `~/${f}`));
    allSkipped.push(...result.filesSkipped.map((f) => `~/${f}`));
    allErrors.push(...result.errors);
  }

  return {
    success: allErrors.length === 0,
    filesCreated: allCreated,
    filesSkipped: allSkipped,
    errors: allErrors,
  };
}

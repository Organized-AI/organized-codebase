/**
 * Project Detector
 *
 * Analyzes the current directory to understand project context.
 * This information drives the adaptive wizard flow.
 */

import fs from 'fs-extra';
import path from 'path';
import { simpleGit } from 'simple-git';
import { glob } from 'glob';
import type {
  ProjectContext,
  TechStack,
  ProjectSize,
  PackageJson,
  ClaudeSettings,
} from './types.js';

/**
 * Detect the tech stack from project files
 */
async function detectTechStack(cwd: string): Promise<TechStack> {
  const checks: Array<{ files: string[]; stack: TechStack }> = [
    { files: ['package.json', 'tsconfig.json', 'node_modules'], stack: 'node' },
    { files: ['requirements.txt', 'pyproject.toml', 'setup.py', 'Pipfile'], stack: 'python' },
    { files: ['Gemfile', 'Rakefile', '.ruby-version'], stack: 'ruby' },
    { files: ['go.mod', 'go.sum'], stack: 'go' },
    { files: ['Cargo.toml', 'Cargo.lock'], stack: 'rust' },
  ];

  for (const { files, stack } of checks) {
    for (const file of files) {
      if (await fs.pathExists(path.join(cwd, file))) {
        return stack;
      }
    }
  }

  return 'unknown';
}

/**
 * Determine project size based on file count
 */
async function detectProjectSize(cwd: string): Promise<ProjectSize> {
  try {
    const files = await glob('**/*', {
      cwd,
      ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', 'vendor/**'],
      nodir: true,
    });

    const count = files.length;
    if (count < 50) return 'small';
    if (count < 500) return 'medium';
    return 'large';
  } catch {
    return 'medium'; // Default assumption
  }
}

/**
 * Check if project is a monorepo
 */
async function detectMonorepo(cwd: string): Promise<boolean> {
  // Check for common monorepo indicators
  const indicators = [
    'lerna.json',
    'pnpm-workspace.yaml',
    'nx.json',
    'rush.json',
    'packages', // directory
    'apps', // directory
  ];

  for (const indicator of indicators) {
    const fullPath = path.join(cwd, indicator);
    if (await fs.pathExists(fullPath)) {
      // For directories, also check if they contain subdirectories with package.json
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        const subdirs = await fs.readdir(fullPath);
        for (const subdir of subdirs) {
          if (await fs.pathExists(path.join(fullPath, subdir, 'package.json'))) {
            return true;
          }
        }
      } else {
        return true;
      }
    }
  }

  // Check package.json for workspaces
  const packageJsonPath = path.join(cwd, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const pkg = await fs.readJson(packageJsonPath);
      if (pkg.workspaces) return true;
    } catch {
      // Ignore parse errors
    }
  }

  return false;
}

/**
 * Get existing Claude Code configuration
 */
async function getExistingClaudeConfig(cwd: string): Promise<{
  hasClaudeDir: boolean;
  existingCommands: string[];
  existingSkills: string[];
  existingAgents: string[];
  existingConfig?: ClaudeSettings;
}> {
  const claudeDir = path.join(cwd, '.claude');
  const hasClaudeDir = await fs.pathExists(claudeDir);

  if (!hasClaudeDir) {
    return {
      hasClaudeDir: false,
      existingCommands: [],
      existingSkills: [],
      existingAgents: [],
    };
  }

  // Find existing commands
  const commandsDir = path.join(claudeDir, 'commands');
  let existingCommands: string[] = [];
  if (await fs.pathExists(commandsDir)) {
    const files = await glob('**/*.md', { cwd: commandsDir });
    existingCommands = files.map((f) => f.replace(/\.md$/, ''));
  }

  // Find existing skills
  const skillsDir = path.join(claudeDir, 'skills');
  let existingSkills: string[] = [];
  if (await fs.pathExists(skillsDir)) {
    const dirs = await fs.readdir(skillsDir);
    existingSkills = dirs.filter(async (d) => {
      const stat = await fs.stat(path.join(skillsDir, d));
      return stat.isDirectory();
    });
  }

  // Find existing agents
  const agentsDir = path.join(claudeDir, 'agents');
  let existingAgents: string[] = [];
  if (await fs.pathExists(agentsDir)) {
    const files = await glob('*.md', { cwd: agentsDir });
    existingAgents = files.map((f) => f.replace(/\.md$/, ''));
  }

  // Read existing settings
  let existingConfig: ClaudeSettings | undefined;
  const settingsPath = path.join(claudeDir, 'settings.json');
  if (await fs.pathExists(settingsPath)) {
    try {
      existingConfig = await fs.readJson(settingsPath);
    } catch {
      // Ignore parse errors
    }
  }

  return {
    hasClaudeDir,
    existingCommands,
    existingSkills,
    existingAgents,
    existingConfig,
  };
}

/**
 * Get project name from package.json or directory name
 */
async function getProjectName(cwd: string, packageJson?: PackageJson): Promise<string> {
  if (packageJson?.name) {
    return packageJson.name;
  }
  return path.basename(cwd);
}

/**
 * Main detector function - analyzes project and returns context
 */
export async function detectProject(cwd: string): Promise<ProjectContext> {
  const git = simpleGit(cwd);

  // Check git status
  let isGitRepo = false;
  let gitBranch: string | undefined;
  try {
    isGitRepo = await git.checkIsRepo();
    if (isGitRepo) {
      const status = await git.status();
      gitBranch = status.current ?? undefined;
    }
  } catch {
    isGitRepo = false;
  }

  // Read package.json if exists
  let packageJson: PackageJson | undefined;
  const packageJsonPath = path.join(cwd, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    try {
      packageJson = await fs.readJson(packageJsonPath);
    } catch {
      // Ignore parse errors
    }
  }

  // Run all detections in parallel
  const [techStack, projectSize, isMonorepo, claudeConfig] = await Promise.all([
    detectTechStack(cwd),
    detectProjectSize(cwd),
    detectMonorepo(cwd),
    getExistingClaudeConfig(cwd),
  ]);

  // Check for CLAUDE.md
  const hasCLAUDEmd = await fs.pathExists(path.join(cwd, 'CLAUDE.md'));

  // Get project name
  const projectName = await getProjectName(cwd, packageJson);

  return {
    cwd,
    isGitRepo,
    gitBranch,
    techStack,
    hasClaudeDir: claudeConfig.hasClaudeDir,
    existingCommands: claudeConfig.existingCommands,
    existingSkills: claudeConfig.existingSkills,
    existingAgents: claudeConfig.existingAgents,
    hasCLAUDEmd,
    existingConfig: claudeConfig.existingConfig,
    packageJson,
    projectSize,
    isMonorepo,
    projectName,
  };
}

/**
 * Format detected context for display
 */
export function formatContext(ctx: ProjectContext): string {
  const parts: string[] = [];

  // Tech stack
  if (ctx.techStack !== 'unknown') {
    const stackLabels: Record<TechStack, string> = {
      node: 'Node.js',
      python: 'Python',
      ruby: 'Ruby',
      go: 'Go',
      rust: 'Rust',
      unknown: 'Unknown',
    };
    parts.push(stackLabels[ctx.techStack]);
  }

  // Git
  if (ctx.isGitRepo) {
    parts.push('Git repository');
  }

  // Monorepo
  if (ctx.isMonorepo) {
    parts.push('Monorepo');
  }

  return parts.join(' • ');
}

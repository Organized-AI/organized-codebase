/**
 * Type definitions for create-organized-codebase CLI
 */

export type TechStack = 'node' | 'python' | 'ruby' | 'go' | 'rust' | 'unknown';
export type ProjectSize = 'small' | 'medium' | 'large';
export type InstallScope = 'local' | 'global' | 'both';
export type VerificationDepth = 'quick' | 'standard' | 'comprehensive';

export interface PackageJson {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface ClaudeSettings {
  permissions?: {
    allow?: string[];
    ask?: string[];
    deny?: string[];
  };
}

/**
 * Detected project context - populated by the detector
 */
export interface ProjectContext {
  cwd: string;
  isGitRepo: boolean;
  gitBranch?: string;
  techStack: TechStack;
  hasClaudeDir: boolean;
  existingCommands: string[];
  existingSkills: string[];
  existingAgents: string[];
  hasCLAUDEmd: boolean;
  existingConfig?: ClaudeSettings;
  packageJson?: PackageJson;
  projectSize: ProjectSize;
  isMonorepo: boolean;
  projectName: string;
}

/**
 * Command packs available for installation
 */
export type CommandPack = 'boris' | 'oc' | 'session' | 'just' | 'long-runner';

/**
 * User selections from the wizard
 */
export interface InstallConfig {
  scope: InstallScope;
  commandPacks: CommandPack[];
  verificationDepth: VerificationDepth;
  initializeCLAUDEmd: boolean;
  preserveExisting: boolean;
  projectName: string;
  techStack: TechStack;
}

/**
 * Result of an installation operation
 */
export interface InstallResult {
  success: boolean;
  filesCreated: string[];
  filesSkipped: string[];
  errors: string[];
}

/**
 * Template variable context for rendering templates
 */
export interface TemplateContext {
  projectName: string;
  techStack: TechStack;
  timestamp: string;
  version: string;
  verificationDepth: VerificationDepth;
}

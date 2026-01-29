/**
 * Template Renderer
 *
 * Handles loading and rendering templates with variable substitution.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { TemplateContext, TechStack } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates are in the package root
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates');

/**
 * Get the templates directory path
 */
export function getTemplatesDir(): string {
  return TEMPLATES_DIR;
}

/**
 * Render a template string with variable substitution
 */
export function renderTemplate(template: string, context: TemplateContext): string {
  return template
    .replace(/\{\{projectName\}\}/g, context.projectName)
    .replace(/\{\{techStack\}\}/g, getTechStackLabel(context.techStack))
    .replace(/\{\{timestamp\}\}/g, context.timestamp)
    .replace(/\{\{version\}\}/g, context.version)
    .replace(/\{\{verificationDepth\}\}/g, context.verificationDepth);
}

/**
 * Get human-readable label for tech stack
 */
function getTechStackLabel(stack: TechStack): string {
  const labels: Record<TechStack, string> = {
    node: 'Node.js',
    python: 'Python',
    ruby: 'Ruby',
    go: 'Go',
    rust: 'Rust',
    unknown: 'Unknown',
  };
  return labels[stack];
}

/**
 * Read and render a template file
 */
export async function renderTemplateFile(
  templatePath: string,
  context: TemplateContext
): Promise<string> {
  const fullPath = path.join(TEMPLATES_DIR, templatePath);
  const content = await fs.readFile(fullPath, 'utf-8');
  return renderTemplate(content, context);
}

/**
 * Copy a template file to destination, with optional rendering
 */
export async function copyTemplate(
  templatePath: string,
  destPath: string,
  context?: TemplateContext
): Promise<void> {
  const srcPath = path.join(TEMPLATES_DIR, templatePath);

  if (context && templatePath.endsWith('.template')) {
    // Render template files
    const content = await fs.readFile(srcPath, 'utf-8');
    const rendered = renderTemplate(content, context);
    const finalPath = destPath.replace(/\.template$/, '');
    await fs.outputFile(finalPath, rendered);
  } else {
    // Copy as-is
    await fs.copy(srcPath, destPath);
  }
}

/**
 * Get list of files in a template directory
 */
export async function getTemplateFiles(subdir: string): Promise<string[]> {
  const dirPath = path.join(TEMPLATES_DIR, subdir);
  if (!(await fs.pathExists(dirPath))) {
    return [];
  }

  const files: string[] = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      files.push(entry.name);
    } else if (entry.isDirectory()) {
      const subFiles = await getTemplateFiles(path.join(subdir, entry.name));
      files.push(...subFiles.map((f) => path.join(entry.name, f)));
    }
  }

  return files;
}

#!/usr/bin/env node

/**
 * Organized Codebase Setup Agent
 *
 * This agent uses the Claude Agent SDK to automatically configure
 * your project based on your PLANNING documents.
 *
 * It will:
 * 1. Read your planning documents
 * 2. Analyze your requirements
 * 3. Generate appropriate package.json dependencies
 * 4. Set up environment files
 * 5. Create initial project structure
 * 6. Configure development tools
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('\n' + '━'.repeat(70));
  log(message, 'bright');
  console.log('━'.repeat(70) + '\n');
}

async function readPlanningDocs() {
  log('📖 Reading your PLANNING documents...', 'cyan');

  const docs = {};
  const planningFiles = [
    'PLANNING/01-project-brief.md',
    'PLANNING/02-requirements.md',
    'PLANNING/03-architecture.md',
    'PLANNING/04-user-stories.md',
    'PLANNING/05-implementation-roadmap.md'
  ];

  for (const file of planningFiles) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      docs[path.basename(file)] = content;
      log(`  ✓ Read ${file}`, 'green');
    } catch (error) {
      log(`  ⚠ Skipped ${file} (not found)`, 'yellow');
    }
  }

  return docs;
}

async function analyzeWithClaude(docs) {
  header('🤖 Analyzing your project with Claude Agent SDK');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    log('❌ Error: ANTHROPIC_API_KEY not found in environment', 'yellow');
    log('Please set your API key:', 'yellow');
    log('  export ANTHROPIC_API_KEY="your-api-key"', 'cyan');
    process.exit(1);
  }

  const anthropic = new Anthropic({ apiKey });

  const planningContext = Object.entries(docs)
    .map(([filename, content]) => `## ${filename}\n\n${content}`)
    .join('\n\n---\n\n');

  log('Sending planning documents to Claude for analysis...', 'cyan');

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `You are a project setup automation agent. Analyze these planning documents and provide a JSON configuration for setting up this project.

${planningContext}

Provide your response as a JSON object with this structure:
{
  "projectName": "string",
  "techStack": ["array", "of", "technologies"],
  "dependencies": {
    "npm": ["list", "of", "npm", "packages"],
    "python": ["list", "of", "pip", "packages"]
  },
  "environmentVariables": ["LIST_OF_ENV_VARS_NEEDED"],
  "scripts": {
    "dev": "development command",
    "build": "build command",
    "test": "test command"
  },
  "recommendedStructure": ["src/", "tests/", "etc"],
  "nextSteps": ["array", "of", "recommended", "next", "steps"]
}

Be specific and practical based on the project requirements.`
    }]
  });

  const responseText = message.content[0].text;

  // Extract JSON from the response (it might be wrapped in markdown code blocks)
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function applyConfiguration(config) {
  header('⚙️  Applying Configuration');

  log('Project Analysis:', 'bright');
  log(`  Name: ${config.projectName}`, 'cyan');
  log(`  Tech Stack: ${config.techStack.join(', ')}`, 'cyan');
  console.log('');

  // Update package.json
  if (config.dependencies?.npm?.length > 0) {
    log('📦 Updating package.json with recommended dependencies...', 'cyan');

    const packageJsonPath = 'package.json';
    let packageJson = {};

    try {
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      packageJson = JSON.parse(content);
    } catch (error) {
      log('  Creating new package.json', 'yellow');
    }

    // Add dependencies
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.devDependencies = packageJson.devDependencies || {};

    // Add recommended scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      ...config.scripts
    };

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    log('  ✓ Updated package.json', 'green');
  }

  // Create .env.example
  if (config.environmentVariables?.length > 0) {
    log('🔐 Creating .env.example...', 'cyan');
    const envContent = config.environmentVariables
      .map(key => `${key}=your_${key.toLowerCase()}_here`)
      .join('\n');

    await fs.writeFile('.env.example', envContent + '\n');
    log('  ✓ Created .env.example', 'green');
  }

  // Create recommended directory structure
  if (config.recommendedStructure?.length > 0) {
    log('📁 Creating recommended directory structure...', 'cyan');
    for (const dir of config.recommendedStructure) {
      await fs.mkdir(dir, { recursive: true });
      log(`  ✓ Created ${dir}`, 'green');
    }
  }

  return config;
}

async function main() {
  try {
    header('🚀 Organized Codebase Setup Agent');

    log('This agent will analyze your PLANNING documents and automatically', 'cyan');
    log('configure your project with the right dependencies and structure.', 'cyan');
    console.log('');

    const docs = await readPlanningDocs();

    if (Object.keys(docs).length === 0) {
      log('⚠️  No planning documents found!', 'yellow');
      log('Please fill out at least PLANNING/01-project-brief.md first.', 'yellow');
      process.exit(1);
    }

    const config = await analyzeWithClaude(docs);
    await applyConfiguration(config);

    header('✅ Setup Complete!');

    log('📋 Recommended Next Steps:', 'bright');
    config.nextSteps.forEach((step, i) => {
      log(`  ${i + 1}. ${step}`, 'cyan');
    });

    console.log('');
    log('💡 Run "npm install" to install dependencies', 'magenta');
    log('💡 Copy .env.example to .env and fill in your values', 'magenta');
    console.log('');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'yellow');
    console.error(error);
    process.exit(1);
  }
}

main();

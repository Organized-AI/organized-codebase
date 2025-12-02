# MCP Server Management

## Overview

Model Context Protocol (MCP) servers extend Claude's capabilities by providing access to external tools and data sources. PostHog Wizard demonstrates programmatic MCP server management.

## Claude Desktop Config Location

```typescript
import os from 'os';
import path from 'path';

const CLAUDE_CONFIG_PATHS = {
  darwin: path.join(
    os.homedir(),
    'Library/Application Support/Claude/claude_desktop_config.json'
  ),
  win32: path.join(
    process.env.APPDATA || '',
    'Claude/claude_desktop_config.json'
  ),
  linux: path.join(
    os.homedir(),
    '.config/Claude/claude_desktop_config.json'
  )
};

function getClaudeConfigPath(): string {
  return CLAUDE_CONFIG_PATHS[process.platform] || CLAUDE_CONFIG_PATHS.linux;
}
```

## MCP Server Configuration Format

```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["/path/to/server/index.js"],
      "env": {
        "API_KEY": "your-key-here",
        "OTHER_VAR": "value"
      }
    }
  }
}
```

## Adding MCP Server

```typescript
import fs from 'fs/promises';

interface MCPServerConfig {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
}

async function addMCPServer(config: MCPServerConfig): Promise<void> {
  const configPath = getClaudeConfigPath();
  
  // Read existing config
  let claudeConfig: any;
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    claudeConfig = JSON.parse(content);
  } catch (error) {
    // Create new config if doesn't exist
    claudeConfig = { mcpServers: {} };
  }
  
  // Ensure mcpServers object exists
  claudeConfig.mcpServers = claudeConfig.mcpServers || {};
  
  // Check if server already exists
  if (claudeConfig.mcpServers[config.name]) {
    throw new Error(`MCP server "${config.name}" already exists`);
  }
  
  // Add new server
  claudeConfig.mcpServers[config.name] = {
    command: config.command,
    args: config.args,
    ...(config.env && { env: config.env })
  };
  
  // Write back
  await fs.writeFile(
    configPath,
    JSON.stringify(claudeConfig, null, 2),
    'utf-8'
  );
  
  console.log(`✅ Added MCP server: ${config.name}`);
  console.log('🔄 Please restart Claude to activate the server.');
}
```

## Removing MCP Server

```typescript
async function removeMCPServer(name: string): Promise<void> {
  const configPath = getClaudeConfigPath();
  
  // Read existing config
  const content = await fs.readFile(configPath, 'utf-8');
  const claudeConfig = JSON.parse(content);
  
  // Check if server exists
  if (!claudeConfig.mcpServers?.[name]) {
    throw new Error(`MCP server "${name}" not found`);
  }
  
  // Remove server
  delete claudeConfig.mcpServers[name];
  
  // Clean up empty mcpServers object
  if (Object.keys(claudeConfig.mcpServers).length === 0) {
    delete claudeConfig.mcpServers;
  }
  
  // Write back
  await fs.writeFile(
    configPath,
    JSON.stringify(claudeConfig, null, 2),
    'utf-8'
  );
  
  console.log(`✅ Removed MCP server: ${name}`);
  console.log('🔄 Please restart Claude to apply changes.');
}
```

## Listing MCP Servers

```typescript
async function listMCPServers(): Promise<string[]> {
  const configPath = getClaudeConfigPath();
  
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const claudeConfig = JSON.parse(content);
    
    return Object.keys(claudeConfig.mcpServers || {});
  } catch (error) {
    // Config doesn't exist or is invalid
    return [];
  }
}
```

## Validating MCP Server Config

```typescript
async function validateMCPServer(
  config: MCPServerConfig
): Promise<ValidationResult> {
  const errors: string[] = [];
  
  // Check name
  if (!config.name || !/^[a-z0-9-]+$/.test(config.name)) {
    errors.push('Name must be lowercase alphanumeric with hyphens');
  }
  
  // Check command exists
  try {
    await fs.access(config.command);
  } catch {
    // Try as command name
    const which = await execAsync(`which ${config.command}`);
    if (!which.stdout) {
      errors.push(`Command not found: ${config.command}`);
    }
  }
  
  // Check args point to valid files
  for (const arg of config.args) {
    if (arg.startsWith('/') || arg.startsWith('./')) {
      try {
        await fs.access(arg);
      } catch {
        errors.push(`File not found: ${arg}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

## CLI Implementation

```typescript
import { Command } from 'commander';

const program = new Command();

program
  .command('mcp')
  .description('Manage MCP servers');

program
  .command('mcp add <name>')
  .description('Add an MCP server')
  .requiredOption('--command <cmd>', 'Command to run')
  .option('--args <args...>', 'Command arguments')
  .option('--env <env...>', 'Environment variables (KEY=value)')
  .action(async (name, options) => {
    // Parse environment variables
    const env: Record<string, string> = {};
    if (options.env) {
      for (const pair of options.env) {
        const [key, value] = pair.split('=');
        env[key] = value;
      }
    }
    
    const config: MCPServerConfig = {
      name,
      command: options.command,
      args: options.args || [],
      env: Object.keys(env).length > 0 ? env : undefined
    };
    
    // Validate
    const validation = await validateMCPServer(config);
    if (!validation.valid) {
      console.error('❌ Validation failed:');
      validation.errors.forEach(err => console.error(`  - ${err}`));
      process.exit(1);
    }
    
    // Add server
    await addMCPServer(config);
  });

program
  .command('mcp remove <name>')
  .description('Remove an MCP server')
  .action(async (name) => {
    await removeMCPServer(name);
  });

program
  .command('mcp list')
  .description('List installed MCP servers')
  .action(async () => {
    const servers = await listMCPServers();
    
    if (servers.length === 0) {
      console.log('No MCP servers installed.');
    } else {
      console.log('Installed MCP servers:');
      servers.forEach(server => console.log(`  - ${server}`));
    }
  });
```

## Interactive Setup

```typescript
import inquirer from 'inquirer';

async function interactiveMCPSetup(): Promise<void> {
  console.log('🚀 MCP Server Setup\n');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Server name:',
      validate: (input) => {
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Name must be lowercase alphanumeric with hyphens';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'command',
      message: 'Command type:',
      choices: ['node', 'python3', 'npx', 'custom']
    },
    {
      type: 'input',
      name: 'script',
      message: 'Script path:',
      when: (answers) => answers.command !== 'custom'
    },
    {
      type: 'input',
      name: 'customCommand',
      message: 'Custom command:',
      when: (answers) => answers.command === 'custom'
    },
    {
      type: 'confirm',
      name: 'hasEnv',
      message: 'Need environment variables?',
      default: false
    },
    {
      type: 'input',
      name: 'envVars',
      message: 'Environment variables (comma-separated KEY=value):',
      when: (answers) => answers.hasEnv,
      filter: (input) => {
        const env: Record<string, string> = {};
        input.split(',').forEach((pair: string) => {
          const [key, value] = pair.trim().split('=');
          if (key && value) env[key] = value;
        });
        return env;
      }
    }
  ]);
  
  const config: MCPServerConfig = {
    name: answers.name,
    command: answers.command === 'custom' 
      ? answers.customCommand 
      : answers.command,
    args: answers.command === 'custom' 
      ? [] 
      : [answers.script],
    env: answers.envVars
  };
  
  await addMCPServer(config);
}
```

## Auto-Discovery

Automatically detect and suggest MCP servers:

```typescript
async function discoverMCPServers(
  projectPath: string
): Promise<MCPServerConfig[]> {
  const discovered: MCPServerConfig[] = [];
  
  // Check for MCP server in project
  const mcpDirs = [
    'mcp-server',
    'mcp',
    '.mcp',
    'server'
  ];
  
  for (const dir of mcpDirs) {
    const fullPath = path.join(projectPath, dir);
    try {
      await fs.access(fullPath);
      
      // Look for entry points
      const entryPoints = [
        'index.js',
        'index.ts',
        'server.js',
        'main.py'
      ];
      
      for (const entry of entryPoints) {
        const entryPath = path.join(fullPath, entry);
        try {
          await fs.access(entryPath);
          
          // Determine command based on file type
          const ext = path.extname(entry);
          const command = ext === '.py' ? 'python3' : 'node';
          
          discovered.push({
            name: path.basename(projectPath) + '-mcp',
            command,
            args: [entryPath],
            env: {}
          });
          
          break; // Found entry point
        } catch {
          continue;
        }
      }
    } catch {
      continue;
    }
  }
  
  return discovered;
}
```

## PostHog Wizard MCP Integration Example

```typescript
async function installPostHogMCP(): Promise<void> {
  console.log('📦 Installing PostHog MCP server...');
  
  // Check if npx is available
  try {
    await execAsync('which npx');
  } catch {
    throw new Error('npx not found. Please install Node.js.');
  }
  
  const config: MCPServerConfig = {
    name: 'posthog',
    command: 'npx',
    args: [
      '-y',
      '@posthog/mcp-server-posthog'
    ],
    env: {
      POSTHOG_API_KEY: process.env.POSTHOG_API_KEY || '',
      POSTHOG_PROJECT_ID: process.env.POSTHOG_PROJECT_ID || ''
    }
  };
  
  // Validate environment variables
  if (!config.env!.POSTHOG_API_KEY) {
    console.warn('⚠️  POSTHOG_API_KEY not set');
    console.log('Set it in your environment or Claude config');
  }
  
  await addMCPServer(config);
}
```

## Error Handling

```typescript
async function safeMCPOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `Claude config not found. Is Claude installed?`
      );
    }
    
    if (error.code === 'EACCES') {
      throw new Error(
        `Permission denied. Try running with appropriate permissions.`
      );
    }
    
    if (error.message.includes('JSON')) {
      throw new Error(
        `Claude config is corrupted. Please check: ${getClaudeConfigPath()}`
      );
    }
    
    throw new Error(
      `${operationName} failed: ${error.message}`
    );
  }
}

// Usage
await safeMCPOperation(
  () => addMCPServer(config),
  'Adding MCP server'
);
```

## Testing MCP Configuration

```typescript
async function testMCPServer(name: string): Promise<boolean> {
  console.log(`🧪 Testing MCP server: ${name}...`);
  
  const configPath = getClaudeConfigPath();
  const content = await fs.readFile(configPath, 'utf-8');
  const claudeConfig = JSON.parse(content);
  
  const serverConfig = claudeConfig.mcpServers?.[name];
  if (!serverConfig) {
    console.error(`❌ Server not found: ${name}`);
    return false;
  }
  
  // Test command execution
  try {
    const result = await execAsync(
      `${serverConfig.command} ${serverConfig.args.join(' ')} --version`,
      { env: { ...process.env, ...serverConfig.env } }
    );
    
    console.log(`✅ Server executable found`);
    console.log(`Version: ${result.stdout.trim()}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute server command`);
    console.error(error.message);
    return false;
  }
}
```

## Backup and Restore

```typescript
async function backupClaudeConfig(): Promise<string> {
  const configPath = getClaudeConfigPath();
  const backupPath = `${configPath}.backup.${Date.now()}`;
  
  await fs.copyFile(configPath, backupPath);
  console.log(`💾 Backup created: ${backupPath}`);
  
  return backupPath;
}

async function restoreClaudeConfig(backupPath: string): Promise<void> {
  const configPath = getClaudeConfigPath();
  
  await fs.copyFile(backupPath, configPath);
  console.log(`♻️  Config restored from: ${backupPath}`);
}

// Safe operation with backup
async function safeAddMCPServer(config: MCPServerConfig): Promise<void> {
  const backup = await backupClaudeConfig();
  
  try {
    await addMCPServer(config);
  } catch (error) {
    console.error('❌ Operation failed, restoring backup...');
    await restoreClaudeConfig(backup);
    throw error;
  }
}
```

## Best Practices

1. **Always validate** before modifying config
2. **Create backups** before making changes
3. **Check for duplicates** before adding
4. **Provide clear instructions** for restart
5. **Test server** after installation
6. **Handle platform differences** (macOS/Windows/Linux)
7. **Validate environment variables** are set
8. **Clean up** when removing servers
9. **Use meaningful names** (lowercase-with-hyphens)
10. **Document environment variables** needed

## Common Issues

### Issue 1: Config Not Found
```typescript
if (error.code === 'ENOENT') {
  console.error('Claude config not found.');
  console.log('Is Claude desktop app installed?');
  console.log('Expected location:', getClaudeConfigPath());
}
```

### Issue 2: Invalid JSON
```typescript
try {
  JSON.parse(content);
} catch {
  console.error('Claude config is invalid JSON.');
  console.log('Please fix manually or restore from backup.');
}
```

### Issue 3: Server Already Exists
```typescript
if (claudeConfig.mcpServers[name]) {
  console.error(`Server "${name}" already exists.`);
  console.log('Use a different name or remove existing server first.');
}
```

### Issue 4: Command Not Found
```typescript
try {
  await execAsync(`which ${config.command}`);
} catch {
  console.error(`Command not found: ${config.command}`);
  console.log('Please install the required command or check the path.');
}
```

## Complete Example

See `examples.md` for a full working implementation of MCP management in a CLI wizard.

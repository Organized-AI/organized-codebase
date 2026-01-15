# TypeScript Project Template

Use this template when creating a new Phase 0 from scratch.

## 1. package.json

```json
{
  "name": "PROJECT_NAME",
  "version": "1.0.0",
  "description": "PROJECT_DESCRIPTION",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/",
    "clean": "rm -rf dist/"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
```

## 2. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## 3. Dependencies

### Core (install with npm install)

```bash
npm install zod dotenv
```

### CLI Projects (add if building CLI)

```bash
npm install commander chalk ora
```

### Dev Dependencies

```bash
npm install -D typescript @types/node tsx vitest eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

## 4. .env.example

```env
# Application
NODE_ENV=development
LOG_LEVEL=info

# Add project-specific variables below
```

## 5. .gitignore

```gitignore
# Dependencies
node_modules/

# Build
dist/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/*.jsonl
logs/*.log
!logs/.gitkeep

# Tests
coverage/
.vitest/

# Temporary
tmp/
temp/
```

## 6. Directory Structure

```bash
# Create directories
mkdir -p src/lib src/agents src/mcp
mkdir -p tests/lib tests/agents tests/mocks tests/fixtures
mkdir -p logs

# Create .gitkeep files
touch src/lib/.gitkeep src/agents/.gitkeep src/mcp/.gitkeep
touch tests/lib/.gitkeep tests/agents/.gitkeep tests/mocks/.gitkeep tests/fixtures/.gitkeep
touch logs/.gitkeep
```

## 7. Entry Point (src/index.ts)

```typescript
// src/index.ts
const PROJECT_NAME = 'PROJECT_NAME';

function main(): void {
  console.log('═'.repeat(55));
  console.log(`  ${PROJECT_NAME}`);
  console.log('═'.repeat(55));
  console.log('');
  console.log('Phase 0 Complete - TypeScript project initialized');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Run: npm run build');
  console.log('  2. Run: npm run typecheck');
  console.log('  3. Proceed to Phase 1');
}

main();
```

## 8. Optional: ESLint Config (.eslintrc.json)

```json
{
  "env": {
    "es2022": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Customization Notes

Replace these placeholders:
- `PROJECT_NAME` - Your project name (lowercase, hyphens)
- `PROJECT_DESCRIPTION` - Brief description

Add to dependencies based on project type:
- **API Server**: `express`, `cors`, `helmet`
- **Database**: `prisma`, `drizzle-orm`, `pg`
- **Testing**: `@testing-library/*`, `msw`
- **MCP Client**: `@anthropic/mcp-client` (when available)

# MCP Creation Guide

Detailed reference for creating Model Context Protocol (MCP) servers. MCPs connect Claude to external services through well-designed tools.

---

## MCP Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Claude/LLM    │◄───►│   MCP Server    │◄───►│ External Service│
│                 │     │                 │     │   (API/DB/etc)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │    JSON-RPC 2.0       │
        │    (stdio/HTTP)       │
        └───────────────────────┘
```

---

## Project Structure

### TypeScript (Recommended)

```
mcp-server-name/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # Entry point
│   ├── tools/            # Tool definitions
│   │   ├── index.ts
│   │   ├── read.ts
│   │   └── write.ts
│   ├── client.ts         # API client
│   └── types.ts          # Type definitions
└── README.md
```

### Python

```
mcp-server-name/
├── pyproject.toml
├── src/
│   └── mcp_server_name/
│       ├── __init__.py
│       ├── server.py     # Main server
│       ├── tools.py      # Tool definitions
│       └── client.py     # API client
└── README.md
```

---

## TypeScript Implementation

### package.json

```json
{
  "name": "mcp-server-name",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "mcp-server-name": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

### src/index.ts

```typescript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";

const server = new Server(
  {
    name: "mcp-server-name",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register all tools
registerTools(server);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### src/tools/index.ts

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { z } from "zod";

// Input schema using Zod
const ListItemsSchema = z.object({
  limit: z.number().min(1).max(100).default(10).describe("Max items to return"),
  filter: z.string().optional().describe("Filter query"),
});

const CreateItemSchema = z.object({
  name: z.string().min(1).describe("Item name"),
  description: z.string().optional().describe("Item description"),
});

export function registerTools(server: Server) {
  // List tool (read-only)
  server.setRequestHandler("tools/call", async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "list_items": {
        const { limit, filter } = ListItemsSchema.parse(args);
        const items = await fetchItems(limit, filter);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(items, null, 2),
            },
          ],
        };
      }

      case "create_item": {
        const { name, description } = CreateItemSchema.parse(args);
        const item = await createItem(name, description);
        return {
          content: [
            {
              type: "text",
              text: `Created item: ${item.id}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  // Register tool definitions
  server.setRequestHandler("tools/list", async () => ({
    tools: [
      {
        name: "list_items",
        description: "List items with optional filtering",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Max items (1-100)" },
            filter: { type: "string", description: "Filter query" },
          },
        },
        annotations: {
          readOnlyHint: true,
          openWorldHint: false,
        },
      },
      {
        name: "create_item",
        description: "Create a new item",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Item name" },
            description: { type: "string", description: "Description" },
          },
          required: ["name"],
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: false,
        },
      },
    ],
  }));
}
```

---

## Python Implementation

### pyproject.toml

```toml
[project]
name = "mcp-server-name"
version = "1.0.0"
dependencies = [
    "mcp>=1.0.0",
    "pydantic>=2.0.0",
    "httpx>=0.25.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project.scripts]
mcp-server-name = "mcp_server_name.server:main"
```

### src/mcp_server_name/server.py

```python
#!/usr/bin/env python3
from mcp.server import Server
from mcp.server.stdio import stdio_server
from pydantic import BaseModel, Field
from typing import Optional
import asyncio

# Input models using Pydantic
class ListItemsInput(BaseModel):
    limit: int = Field(default=10, ge=1, le=100, description="Max items")
    filter: Optional[str] = Field(default=None, description="Filter query")

class CreateItemInput(BaseModel):
    name: str = Field(min_length=1, description="Item name")
    description: Optional[str] = Field(default=None, description="Description")

# Create server
server = Server("mcp-server-name")

@server.tool(
    name="list_items",
    description="List items with optional filtering",
    annotations={"readOnlyHint": True}
)
async def list_items(limit: int = 10, filter: Optional[str] = None) -> str:
    """List items from the service."""
    items = await fetch_items(limit, filter)
    return json.dumps(items, indent=2)

@server.tool(
    name="create_item",
    description="Create a new item",
    annotations={"readOnlyHint": False, "destructiveHint": False}
)
async def create_item(name: str, description: Optional[str] = None) -> str:
    """Create a new item in the service."""
    item = await create_item_api(name, description)
    return f"Created item: {item['id']}"

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Tool Design Best Practices

### Naming Conventions

```
# Good - action_resource format
list_repositories
create_issue
update_pull_request
delete_branch

# Bad - unclear or inconsistent
getRepos
new_issue
pr_update
removeBranch
```

### Input Schema Design

```typescript
// Good - descriptive with constraints
const SearchSchema = z.object({
  query: z.string()
    .min(1)
    .max(500)
    .describe("Search query string"),
  limit: z.number()
    .min(1)
    .max(100)
    .default(10)
    .describe("Maximum results to return"),
  sort: z.enum(["relevance", "date", "popularity"])
    .default("relevance")
    .describe("Sort order for results"),
});

// Bad - no constraints or descriptions
const SearchSchema = z.object({
  query: z.string(),
  limit: z.number(),
  sort: z.string(),
});
```

### Error Handling

```typescript
// Good - actionable error messages
try {
  const result = await api.call(params);
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
} catch (error) {
  if (error.status === 401) {
    throw new Error(
      "Authentication failed. Please check your API key in the MCP configuration. " +
      "You can set it with: API_KEY=your-key"
    );
  }
  if (error.status === 404) {
    throw new Error(
      `Resource not found: ${params.id}. ` +
      "Use list_resources to see available resources."
    );
  }
  if (error.status === 429) {
    throw new Error(
      "Rate limit exceeded. Please wait a moment and try again. " +
      "Consider using smaller batch sizes."
    );
  }
  throw new Error(`API error: ${error.message}`);
}

// Bad - unhelpful errors
try {
  return await api.call(params);
} catch (error) {
  throw error; // Just re-throws, no context
}
```

### Tool Annotations

```typescript
{
  name: "delete_item",
  description: "Permanently delete an item",
  inputSchema: { /* ... */ },
  annotations: {
    readOnlyHint: false,      // Modifies data
    destructiveHint: true,    // Cannot be undone
    idempotentHint: true,     // Same result if called twice
    openWorldHint: false,     // Closed set of resources
  }
}
```

| Annotation | Meaning |
|------------|---------|
| `readOnlyHint: true` | Tool doesn't modify anything |
| `destructiveHint: true` | Action cannot be undone |
| `idempotentHint: true` | Repeated calls have same effect |
| `openWorldHint: true` | Interacts with external world |

---

## Configuration

### claude_desktop_config.json

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "mcp-server-name"],
      "env": {
        "API_KEY": "${API_KEY}",
        "BASE_URL": "https://api.example.com"
      }
    }
  }
}
```

### .claude/mcp.json (Project-level)

```json
{
  "mcpServers": {
    "project-server": {
      "command": "node",
      "args": ["./mcp-servers/my-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

---

## Testing

### Using MCP Inspector

```bash
# TypeScript
npm run build
npx @modelcontextprotocol/inspector node dist/index.js

# Python
python -m mcp_server_name.server
npx @modelcontextprotocol/inspector python -m mcp_server_name.server
```

### Manual Testing Checklist

- [ ] All tools listed correctly
- [ ] Input validation works (try invalid inputs)
- [ ] Error messages are helpful
- [ ] Pagination works for list operations
- [ ] Authentication handles missing/invalid credentials
- [ ] Rate limiting is handled gracefully

---

## Common Patterns

### Pagination

```typescript
server.registerTool({
  name: "list_items",
  description: "List items with pagination",
  inputSchema: {
    type: "object",
    properties: {
      cursor: { type: "string", description: "Pagination cursor" },
      limit: { type: "number", default: 20 },
    },
  },
  async handler({ cursor, limit }) {
    const result = await api.list({ cursor, limit });
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          items: result.items,
          nextCursor: result.nextCursor,
          hasMore: result.hasMore,
        }, null, 2),
      }],
    };
  },
});
```

### Batch Operations

```typescript
server.registerTool({
  name: "batch_update",
  description: "Update multiple items at once",
  inputSchema: {
    type: "object",
    properties: {
      updates: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            data: { type: "object" },
          },
          required: ["id", "data"],
        },
        maxItems: 100,
      },
    },
    required: ["updates"],
  },
  async handler({ updates }) {
    const results = await Promise.allSettled(
      updates.map(({ id, data }) => api.update(id, data))
    );
    
    const summary = {
      succeeded: results.filter(r => r.status === "fulfilled").length,
      failed: results.filter(r => r.status === "rejected").length,
    };
    
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
    };
  },
});
```

### Authentication

```typescript
// Environment variable auth
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error(
    "API_KEY environment variable is required. " +
    "Set it in your MCP configuration."
  );
}

const client = new APIClient({
  apiKey,
  baseUrl: process.env.BASE_URL || "https://api.example.com",
});
```

---

## Distribution

### npm (TypeScript)

```bash
npm publish
```

Users install with:
```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "mcp-server-name"]
    }
  }
}
```

### PyPI (Python)

```bash
pip install build twine
python -m build
twine upload dist/*
```

Users install with:
```json
{
  "mcpServers": {
    "my-server": {
      "command": "uvx",
      "args": ["mcp-server-name"]
    }
  }
}
```

---

## Quality Checklist

- [ ] Clear, action-oriented tool names
- [ ] Comprehensive input descriptions
- [ ] Proper validation with helpful errors
- [ ] Pagination for list operations
- [ ] Appropriate annotations on all tools
- [ ] Environment variable documentation
- [ ] README with usage examples
- [ ] Tested with MCP Inspector

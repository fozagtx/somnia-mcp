# Somnia Monorepo Structure

## Overview
Successfully converted to a pnpm workspace monorepo with two packages:
- `@somnia/mcp-server` - MCP server for blockchain interactions
- `@somnia/agent` - AI agent for autonomous operations

## Directory Structure
```
somnia/
├── packages/
│   ├── mcp-server/
│   │   ├── src/              # TypeScript source (ESM)
│   │   ├── dist/             # Compiled JavaScript
│   │   ├── .env              # Environment configuration
│   │   └── package.json      # Package configuration
│   │
│   └── agent/
│       ├── src/              # TypeScript source (CommonJS)
│       ├── dist/             # Compiled JavaScript
│       ├── .env.example      # Example environment config
│       └── package.json      # Package configuration
│
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # Workspace definition
├── tsconfig.base.json        # Shared TypeScript config
└── README.md                 # Main documentation
```

## Key Features

### Workspace Commands
- `pnpm build` - Build all packages
- `pnpm dev` - Run all in dev mode
- `pnpm clean` - Clean all artifacts

### Package-Specific Commands
- `pnpm mcp:*` - MCP server commands
- `pnpm agent:*` - Agent commands

### Module Systems
- **MCP Server:** ESM (type: "module")
- **Agent:** CommonJS (default)

## Configuration Files

### Root Level
- `pnpm-workspace.yaml` - Defines workspace packages
- `tsconfig.base.json` - Shared TypeScript configuration
- `package.json` - Root workspace scripts and metadata

### Package Level
- Each package has its own `package.json`, `tsconfig.json`, and `.env`
- Packages are independent but can reference each other via workspace protocol

## Build Process
1. `pnpm install` - Installs all dependencies with hoisting
2. `pnpm build` - Runs `pnpm -r build` (recursive)
3. Each package compiles TypeScript to `dist/` directory

## Success Metrics
✅ Clean monorepo structure
✅ Both packages build successfully
✅ Proper TypeScript configuration for each module system
✅ Workspace commands working
✅ Dependencies properly managed
✅ Documentation complete

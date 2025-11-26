# Design Document

## Overview

The Somnia MCP Server is a Model Context Protocol (MCP) server implementation that bridges AI agents with the Somnia blockchain network. The architecture follows a modular design with clear separation of concerns across transport layers, tool registration, blockchain interaction, and configuration management.

The system supports two operational modes:
1. **STDIO Mode**: For local development and direct integration with MCP clients
2. **HTTP Mode**: For remote deployment and stateless operation via REST endpoints

The server integrates multiple tool categories:
- Native Somnia API tools for blockchain queries
- GOAT SDK tools for on-chain operations
- Documentation search via GitBook MCP integration
- Cryptographic signing and wallet management utilities

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        MCP Client                            │
│                    (Claude, AI Agents)                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ JSON-RPC (STDIO or HTTP)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                   MCP Server Core                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Transport Layer (Switchable)                 │   │
│  │  ┌─────────────────┐    ┌──────────────────────┐    │   │
│  │  │ STDIO Transport │    │ HTTP Transport       │    │   │
│  │  │ (Development)   │    │ (Production/Remote)  │    │   │
│  │  └─────────────────┘    └──────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Tool Registry                           │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐   │   │
│  │  │ GOAT SDK   │  │ Somnia API │  │ Custom Tools │   │   │
│  │  │ Tools      │  │ Tools      │  │              │   │   │
│  │  └────────────┘  └────────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────┬────────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌──────────────┐
│ Somnia  │  │ Viem    │  │ GitBook MCP  │
│ RPC API │  │ Wallet  │  │ Docs Server  │
└─────────┘  └─────────┘  └──────────────┘
```

### Module Structure

```
src/
├── index.ts          # Entry point, environment loading
├── server.ts         # MCP server creation, transport setup, tool registration
├── config.ts         # Centralized configuration constants
├── wallet.ts         # Wallet client initialization, chain definitions
├── tools.ts          # Tool definitions (GOAT SDK + custom tools)
├── client.ts         # GitBook MCP client for documentation search
├── utils.ts          # JSON Schema to Zod conversion utilities
└── types.ts          # TypeScript type definitions
```

## Components and Interfaces

### 1. Entry Point (index.ts)

**Purpose**: Application bootstrap and environment initialization

**Responsibilities**:
- Load environment variables from .env file
- Suppress dotenv console output for STDIO compatibility
- Invoke server start function
- Handle fatal errors with proper exit codes

**Key Implementation Details**:
- Uses `fileURLToPath` and `path.dirname` to resolve .env path relative to compiled output
- Temporarily overrides `console.log` during dotenv loading to prevent stdout pollution
- Catches and logs fatal errors before exiting with code 1

### 2. Server Core (server.ts)

**Purpose**: MCP server initialization, transport management, and tool registration

**Key Functions**:

#### `createSomniaServer()`
Creates and configures the MCP server instance with all tools registered.

**Process Flow**:
1. Initialize McpServer with name and version from config
2. Initialize GOAT SDK tools via `toolsPromise()`
3. Build Zod schema map for GOAT tools
4. Register each GOAT tool with:
   - Extracted input schema from Zod
   - Wrapper callback that parses args and invokes toolHandler
5. Register custom Somnia tools with their schemas and callbacks
6. Return configured server instance

#### `start()`
Starts the server in either STDIO or HTTP mode based on environment.

**STDIO Mode**:
- Creates StdioServerTransport
- Connects server to transport
- No console output (uses stderr for debugging if needed)

**HTTP Mode**:
- Creates Express app with JSON middleware
- Configures CORS with wildcard origin and MCP headers
- Registers POST /mcp endpoint:
  - Creates StreamableHTTPServerTransport per request
  - Handles request lifecycle and cleanup
  - Returns JSON-RPC error responses on failure
- Registers GET /mcp and DELETE /mcp with 405 responses
- Registers GET /health endpoint returning "ok"
- Listens on configured HOST and PORT

### 3. Configuration Management (config.ts)

**Purpose**: Centralized configuration constants for all modules

**Configuration Structure**:

```typescript
somniaConfig = {
  general: {
    addressRegex: /^(0x)?[0-9a-fA-F]{40}$/,
    txidRegex: /^0x[0-9a-fA-F]{64}$/
  },
  mainnet: {
    apiBaseUrl: "https://api.infra.mainnet.somnia.network",
    controllerAbortTimeout: 15000,
    rpc: "https://api.infra.mainnet.somnia.network/",
    chainId: 5031
  },
  testnet: {
    apiBaseUrl: "https://dream-rpc.somnia.network",
    controllerAbortTimeout: 15000,
    rpc: "https://dream-rpc.somnia.network/",
    chainId: 50312
  },
  mcpClient: {
    name: "somnia-docs-client",
    version: "1.0.0",
    somniaDocsUrl: "https://docs.somnia.network/"
  },
  mcpServer: {
    name: "somnia-mcp-server",
    version: "1.0.0"
  }
}
```

### 4. Wallet Management (wallet.ts)

**Purpose**: Ethereum-compatible wallet initialization for Somnia blockchain

**Key Components**:

#### Environment Variables
- `currentEnvironment`: ENVIRONMENT variable (MAINNET or other)
- `isMainnet`: Boolean flag derived from environment
- `agentSecretKey`: AGENT_SECRET_KEY private key
- `rpcUrl`: Selected RPC URL based on environment

#### Chain Definitions
Uses viem's `defineChain` to create Somnia chain configurations:

**Mainnet Chain**:
- Chain ID: 5031
- Name: "Somnia Mainnet"
- Native currency: STT (18 decimals)
- RPC: https://api.infra.mainnet.somnia.network/
- Explorer: https://somniascan.io

**Testnet Chain**:
- Chain ID: 50312
- Name: "Somnia Testnet"
- Native currency: STT (18 decimals)
- RPC: https://dream-rpc.somnia.network/
- Explorer: https://testnet.somniascan.io
- Testnet flag: true

#### Wallet Client
- Validates AGENT_SECRET_KEY format (0x + 64 hex chars)
- Converts private key to account using `privateKeyToAccount`
- Creates `WalletClient` with:
  - Account from private key
  - HTTP transport to RPC URL
  - Selected chain definition

### 5. Tool Definitions (tools.ts)

**Purpose**: Define and implement all MCP tools

#### GOAT SDK Tools Integration

**Initialization**:
```typescript
toolsPromise = async () => {
  const { listOfTools, toolHandler } = await getOnChainTools({
    wallet: viem(walletClient),
    plugins: []
  });
  return { listOfTools, toolHandler };
}
```

**Registration Process**:
1. Call `listOfTools()` to get available tools
2. Build Zod schema map using `buildToolZodMap()`
3. Extract input shape from Zod schema
4. Register each tool with MCP server
5. Wrap tool execution with argument parsing and result formatting

#### Custom Somnia Tools

Each tool follows the `SomniaTool` interface:

```typescript
interface SomniaTool {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, ZodTypeAny>;
  callback: (args: any) => Promise<{
    content: Array<{ type: string; text: string }>
  }>;
}
```

**Tool Categories**:

1. **Documentation Search** (`search_documentation`)
   - Connects to GitBook MCP server
   - Calls searchDocumentation tool
   - Returns formatted results

2. **Account Queries** (`get_account`)
   - Validates address format
   - Normalizes address to lowercase with 0x prefix
   - Constructs API URL with revision parameter
   - Implements 15-second timeout
   - Returns account data or error

3. **Transaction Queries** (`get_transaction`)
   - Validates transaction ID format
   - Supports pending, raw, and head parameters
   - Implements 15-second timeout
   - Returns transaction data or error

4. **Block Queries** (`get_block`)
   - Supports revision keywords and numbers
   - Supports expanded and raw parameters
   - Implements 15-second timeout
   - Returns block data or error

5. **Fee Queries** (`get_priority_fee`)
   - No input parameters required
   - Fetches suggested priority fee
   - Implements 15-second timeout
   - Returns fee data or error

6. **Wallet Creation** (`create_wallet`)
   - Generates BIP-39 mnemonic (12/15/18/21/24 words)
   - Derives account at m/44'/60'/0'/0/0
   - Returns mnemonic and address

7. **Certificate Signing** (`sign_certificate`)
   - Requires AGENT_SECRET_KEY
   - Creates certificate with purpose, payload, domain, timestamp, signer
   - Signs message using account.signMessage
   - Returns certificate and signature

8. **Raw Transaction Signing** (`sign_raw_transaction`)
   - Requires AGENT_SECRET_KEY
   - Parses raw transaction hex
   - Signs using account.signTransaction
   - Returns signed transaction and from address

### 6. Documentation Client (client.ts)

**Purpose**: Connect to GitBook MCP server for documentation search

**Implementation**:

#### `createGitbookMcpClient(docsUrl)`
Generic GitBook MCP client factory:
1. Creates MCP Client with name and version
2. Constructs MCP server URL: `${docsUrl}/~gitbook/mcp`
3. Creates StreamableHTTPClientTransport
4. Connects client to transport
5. Returns client and listTools helper

#### `createSomniaDocsMcpClient()`
Specialized client for Somnia documentation:
- Calls `createGitbookMcpClient` with Somnia docs URL
- Handles connection errors
- Returns configured client

### 7. Schema Utilities (utils.ts)

**Purpose**: Convert JSON schemas to Zod schemas for validation

**Key Functions**:

#### `jsonSchemaPropToZod(schema)`
Recursively converts JSON schema properties to Zod types:

**Type Mappings**:
- `enum`: Union of literals
- `const`: Single literal
- `string`: z.string() with minLength, maxLength, pattern
- `number`: z.number() with min, max
- `integer`: z.number().int() with min, max
- `boolean`: z.boolean()
- `array`: z.array() with items schema, minItems, maxItems
- `object`: z.object() with recursive property conversion

**Special Handling**:
- Required fields vs optional fields
- Additional properties with passthrough
- Nested objects and arrays

#### `jsonSchemaToZodRoot(schema)`
Converts root-level JSON schema to Zod:
- Handles object types with properties
- Marks properties as optional based on required array
- Applies additionalProperties rules
- Returns z.object({}) for non-object schemas

#### `buildToolZodMap(listOfTools)`
Creates a Map of tool names to Zod schemas:
- Iterates through tool list
- Converts each tool's inputSchema to Zod
- Handles conversion errors gracefully
- Returns Map<string, ZodTypeAny>

#### `parseToolInput(toolSchemaMap, toolName, input)`
Validates tool input against schema:
- Retrieves schema from map
- Parses input with Zod
- Throws detailed validation errors
- Returns parsed input

### 8. Type Definitions (types.ts)

**Purpose**: TypeScript type safety

**Definitions**:

```typescript
enum REVISION {
  Best = "best",
  Justified = "justified",
  Finalized = "finalized"
}

interface SomniaTool {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  callback: (args: any) => Promise<{
    content: Array<{ type: string; text: string }>
  }>;
}
```

## Data Models

### Environment Configuration

```typescript
{
  ENVIRONMENT: "MAINNET" | "TESTNET",
  AGENT_SECRET_KEY: string, // 0x + 64 hex chars
  USE_STREAMABLE_HTTP: "true" | "false",
  PORT: number,
  HOST: string
}
```

### MCP Tool Response

```typescript
{
  content: Array<{
    type: "text",
    text: string // JSON-formatted result
  }>
}
```

### Account Data

```typescript
{
  balance: string,
  energy: string,
  hasCode: boolean,
  // Additional fields from Somnia API
}
```

### Transaction Data

```typescript
{
  id: string,
  chainTag: number,
  blockRef: string,
  expiration: number,
  clauses: Array<{
    to: string,
    value: string,
    data: string
  }>,
  gasPriceCoef: number,
  gas: number,
  origin: string,
  delegator: string | null,
  size: number,
  meta: {
    blockID: string,
    blockNumber: number,
    blockTimestamp: number
  } | null,
  raw?: string
}
```

### Block Data

```typescript
{
  number: number,
  id: string,
  size: number,
  parentID: string,
  timestamp: number,
  gasLimit: number,
  beneficiary: string,
  gasUsed: number,
  totalScore: number,
  txsRoot: string,
  txsFeatures: number,
  stateRoot: string,
  receiptsRoot: string,
  com: boolean,
  signer: string,
  isTrunk: boolean,
  isFinalized: boolean,
  transactions: string[] | TransactionObject[]
}
```

### Certificate

```typescript
{
  certificate: {
    purpose: "identification" | "attestation" | "verification",
    payload: any,
    timestamp: number,
    domain: string,
    signer: string
  },
  signature: string
}
```

### Wallet Creation Result

```typescript
{
  mnemonic: string,
  address: string
}
```

## Error Handling

### Strategy

The system implements comprehensive error handling at multiple levels:

1. **Startup Errors**
   - Missing or invalid AGENT_SECRET_KEY
   - Environment loading failures
   - Fatal errors exit with code 1

2. **API Request Errors**
   - 15-second timeout with AbortController
   - HTTP status code checking
   - Response body parsing errors
   - Network failures

3. **Tool Execution Errors**
   - Input validation errors with detailed messages
   - Tool-specific error handling
   - Graceful error responses to MCP client

4. **Transport Errors**
   - HTTP mode: JSON-RPC error responses
   - STDIO mode: Silent failure (no stdout pollution)
   - Connection cleanup on errors

### Error Response Format

```typescript
{
  error: string, // Error type or message
  reason: string, // Detailed error reason
  url?: string, // Request URL if applicable
  // Additional context fields
}
```

### Timeout Handling

All API requests use AbortController with 15-second timeout:

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15000);

try {
  const res = await fetch(url, { signal: controller.signal });
  // Process response
} catch (err) {
  const isAbort = err.name === "AbortError";
  return {
    error: isAbort ? "Request timed out" : "Failed to fetch",
    reason: String(err.message ?? err)
  };
} finally {
  clearTimeout(timeout);
}
```

## Testing Strategy

### Unit Testing

**Target Coverage**:
- Schema conversion utilities (utils.ts)
- Configuration loading (config.ts)
- Type definitions (types.ts)

**Test Cases**:
1. JSON Schema to Zod conversion for all types
2. Tool input validation with valid/invalid inputs
3. Configuration constant values
4. Type enum values

### Integration Testing

**Target Coverage**:
- Tool execution with mock responses
- Wallet client initialization
- MCP server creation and tool registration

**Test Cases**:
1. GOAT SDK tool initialization
2. Custom tool callback execution
3. Wallet client creation with test keys
4. Server startup in both modes

### End-to-End Testing

**Target Coverage**:
- Full server lifecycle
- Tool execution through MCP protocol
- API interactions with Somnia network

**Test Cases**:
1. STDIO mode server startup and tool call
2. HTTP mode server startup and /mcp endpoint
3. Account query with testnet address
4. Transaction query with known transaction
5. Block query with block number
6. Wallet creation and validation
7. Certificate signing and verification
8. Documentation search

### Manual Testing

**Scenarios**:
1. MCP Inspector integration
2. Claude Desktop integration
3. Mainnet vs Testnet switching
4. Error handling with invalid inputs
5. Timeout behavior with slow network
6. Docker container deployment

### Test Environment Setup

**Requirements**:
- Somnia testnet access
- Test private key with testnet STT
- Mock MCP client for protocol testing
- Docker for containerization testing

**Test Data**:
- Known testnet addresses with balances
- Known testnet transaction IDs
- Known testnet block numbers
- Test mnemonics and private keys

## Build and Deployment

### Build Process

1. **TypeScript Compilation**
   ```bash
   tsc
   ```
   - Compiles src/ to dist/
   - Target: ES2022
   - Module: ESNext
   - Strict mode enabled

2. **Executable Permissions**
   ```bash
   node -e "require('fs').chmodSync('dist/index.js', 0o755)"
   ```
   - Makes index.js executable for direct invocation

### Development Workflow

1. **Local Development**
   ```bash
   pnpm dev
   ```
   - Runs MCP Inspector with tsx
   - Hot reload on file changes
   - Interactive tool testing

2. **Direct Server Run**
   ```bash
   pnpm dev:server
   ```
   - Runs server without inspector
   - Faster startup for testing

3. **Production Build**
   ```bash
   pnpm build
   pnpm start
   ```
   - Compiles TypeScript
   - Runs compiled JavaScript

### Docker Deployment

1. **Build Image**
   ```bash
   docker build -t somnia-mcp-server .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 --env-file .env somnia-mcp-server
   ```

3. **Environment Variables**
   - Pass via --env-file or -e flags
   - AGENT_SECRET_KEY must be provided
   - Default to HTTP mode in container

### Smithery Deployment

1. **Configuration**: smithery.yaml
2. **Build**: Container runtime with Dockerfile
3. **Environment**: Set via Smithery dashboard
4. **Secrets**: AGENT_SECRET_KEY as secret variable
5. **Start**: HTTP mode on port 3000

### Production Considerations

1. **Security**
   - Never commit AGENT_SECRET_KEY
   - Use secret management systems
   - Restrict MCP server access
   - Use HTTPS for HTTP mode

2. **Monitoring**
   - Log tool execution
   - Track API request latency
   - Monitor error rates
   - Alert on timeout spikes

3. **Scaling**
   - HTTP mode supports horizontal scaling
   - Stateless design enables load balancing
   - Consider rate limiting for API calls

4. **Network Selection**
   - Use testnet for development
   - Validate thoroughly before mainnet
   - Monitor gas costs on mainnet
   - Ensure sufficient STT balance

## Dependencies

### Production Dependencies

- **@goat-sdk/adapter-model-context-protocol** (0.2.11): MCP adapter for GOAT SDK
- **@goat-sdk/core** (0.5.0): Core GOAT SDK functionality
- **@goat-sdk/wallet-viem** (0.3.0): Viem wallet integration for GOAT
- **@modelcontextprotocol/sdk** (1.18.2): Official MCP SDK
- **cors** (2.8.5): CORS middleware for Express
- **dotenv** (17.2.3): Environment variable loading
- **express** (5.1.0): HTTP server framework
- **viem** (2.37.11): Ethereum library for wallet and signing
- **zod** (3.25.76): Schema validation

### Development Dependencies

- **@types/cors** (2.8.19): TypeScript types for cors
- **@types/express** (5.0.3): TypeScript types for express
- **@types/node** (24.5.2): TypeScript types for Node.js
- **tsx** (4.20.5): TypeScript execution for development
- **typescript** (5.9.2): TypeScript compiler

### Version Pinning Strategy

- Exact versions for SDK packages to ensure compatibility
- Minor version flexibility for utility packages
- Regular updates for security patches
- Test thoroughly before upgrading major versions

## Configuration Files

### package.json
- Package metadata and scripts
- Dependency declarations
- ES module configuration
- pnpm package manager specification

### tsconfig.json
- TypeScript compiler options
- Module resolution settings
- Output directory configuration
- Strict type checking

### .env.example
- Template for environment variables
- Documentation for each variable
- Safe to commit (no secrets)

### Dockerfile
- Multi-stage build not needed (simple build)
- Alpine base for small image size
- pnpm for dependency management
- Environment variable defaults

### smithery.yaml
- Container runtime specification
- Build configuration
- Environment variable defaults
- HTTP start command

### .gitignore
- Exclude node_modules, dist, .env
- Include .env.example
- Exclude IDE files

### .dockerignore
- Exclude node_modules, dist, .env
- Exclude .git directory
- Exclude documentation files
- Optimize build context

This design provides a complete blueprint for implementing the Somnia MCP Server replica with all necessary architectural details, component specifications, and deployment considerations.

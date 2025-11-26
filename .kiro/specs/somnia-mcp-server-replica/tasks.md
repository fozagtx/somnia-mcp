# Implementation Plan

- [ ] 1. Initialize project structure and configuration files
  - Create package.json with dependencies, scripts, and ES module configuration
  - Create tsconfig.json with ES2022 target and ESNext module settings
  - Create .env.example with all required environment variables
  - Create .gitignore excluding node_modules, dist, .env, and IDE files
  - Create .dockerignore excluding build artifacts and documentation
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.10, 14.1-14.10, 22.1-22.4_

- [ ] 2. Implement configuration management module
  - Create src/config.ts with all configuration constants
  - Define ADDRESS_REGEX and TXID_REGEX patterns
  - Define mainnet and testnet configuration objects with RPC URLs, chain IDs, and API base URLs
  - Define MCP client and server configuration objects
  - Export somniaConfig object with general, mainnet, testnet, mcpClient, and mcpServer sections
  - _Requirements: 18.1-18.13_

- [ ] 3. Implement TypeScript type definitions
  - Create src/types.ts with REVISION enum (Best, Justified, Finalized)
  - Define SomniaTool interface with name, title, description, inputSchema, and callback properties
  - Ensure inputSchema uses Record<string, ZodTypeAny> type
  - Ensure callback returns Promise with content array structure
  - _Requirements: 19.1-19.4_

- [ ] 4. Implement JSON Schema to Zod conversion utilities
- [ ] 4.1 Create jsonSchemaPropToZod function
  - Implement enum handling with union of literals
  - Implement const handling with single literal
  - Implement string type conversion with minLength, maxLength, and pattern constraints
  - Implement number type conversion with min and max constraints
  - Implement integer type conversion with int() constraint
  - Implement boolean type conversion
  - Implement array type conversion with recursive items schema and minItems/maxItems
  - Implement object type conversion with recursive property handling and required field logic
  - _Requirements: 13.1-13.10_

- [ ] 4.2 Create jsonSchemaToZodRoot function
  - Handle object types with properties
  - Mark properties as optional based on required array
  - Apply additionalProperties rules with passthrough
  - Return z.object({}) for non-object schemas
  - _Requirements: 13.11_

- [ ] 4.3 Create buildToolZodMap function
  - Iterate through tool list and convert each inputSchema to Zod
  - Handle conversion errors gracefully with fallback to z.object({})
  - Return Map<string, ZodTypeAny> of tool names to schemas
  - _Requirements: 13.11_

- [ ] 4.4 Create parseToolInput function
  - Retrieve schema from toolSchemaMap by tool name
  - Parse input with Zod schema
  - Catch ZodError and throw detailed validation error with field paths
  - Return parsed input object
  - _Requirements: 13.12_

- [ ] 5. Implement wallet management module
- [ ] 5.1 Create wallet.ts with environment variable loading
  - Load dotenv with suppressed console output
  - Read ENVIRONMENT variable and set isMainnet flag
  - Read AGENT_SECRET_KEY variable
  - Select RPC URL based on environment
  - _Requirements: 3.1, 3.7_

- [ ] 5.2 Define Somnia chain configurations
  - Create somniaMainnet chain definition with chain ID 5031, STT currency, RPC URL, and explorer
  - Create somniaTestnet chain definition with chain ID 50312, STT currency, RPC URL, explorer, and testnet flag
  - Select somniaChain based on isMainnet flag
  - _Requirements: 3.3, 3.4_

- [ ] 5.3 Validate and initialize wallet client
  - Validate AGENT_SECRET_KEY is not empty
  - Validate AGENT_SECRET_KEY matches pattern ^0x[0-9a-fA-F]{64}$
  - Convert private key to account using privateKeyToAccount
  - Create WalletClient with account, HTTP transport, and chain
  - Export walletClient, account, isMainnet, and somniaChain
  - _Requirements: 3.2, 3.5, 3.6, 2.5, 2.6_

- [ ] 6. Implement GitBook MCP client for documentation search
- [ ] 6.1 Create createGitbookMcpClient function
  - Create MCP Client with name "somnia-docs-client" and version "1.0.0"
  - Construct MCP server URL as ${docsUrl}/~gitbook/mcp
  - Create StreamableHTTPClientTransport with URL
  - Connect client to transport
  - Return client and listTools helper function
  - _Requirements: 11.2, 11.3, 11.4_

- [ ] 6.2 Create createSomniaDocsMcpClient function
  - Call createGitbookMcpClient with Somnia docs URL from config
  - Handle connection errors with console.error and throw
  - Return configured client
  - _Requirements: 11.2_

- [ ] 7. Implement custom Somnia API tools
- [ ] 7.1 Create search_documentation tool
  - Define tool with name, title, description, and query input schema
  - Implement callback that creates Somnia docs MCP client
  - Call searchDocumentation tool with query parameter
  - Return formatted JSON response
  - Handle timeout errors with "Request timed out" message
  - Handle other errors with reason field
  - _Requirements: 11.1-11.8_

- [ ] 7.2 Create get_account tool
  - Define tool with address and revision input schema
  - Validate address with ADDRESS_REGEX pattern
  - Normalize address to lowercase with 0x prefix
  - Construct API URL as /accounts/{address}?revision={revision}
  - Create AbortController with 15-second timeout
  - Fetch account data from API
  - Handle non-200 responses with status and body
  - Handle null data with "Account not found" message
  - Handle timeout with "Request timed out" message
  - Return formatted JSON response
  - _Requirements: 5.1-5.12_

- [ ] 7.3 Create get_transaction tool
  - Define tool with id, pending, raw, and head input schema
  - Validate id with TXID_REGEX pattern
  - Construct API URL as /transactions/{id} with query parameters
  - Create AbortController with 15-second timeout
  - Fetch transaction data from API
  - Handle non-200 responses with status and body
  - Handle null data with "Transaction not found" message
  - Handle timeout with "Request timed out" message
  - Return formatted JSON response
  - _Requirements: 6.1-6.12_

- [ ] 7.4 Create get_block tool
  - Define tool with revision, expanded, and raw input schema
  - Support revision as "best", "justified", "finalized", number, or string
  - Construct API URL as /blocks/{revision} with query parameters
  - Create AbortController with 15-second timeout
  - Fetch block data from API
  - Handle non-200 responses with status and body
  - Handle null data with "Block not found" message
  - Handle timeout with "Request timed out" message
  - Return formatted JSON response
  - _Requirements: 7.1-7.13_

- [ ] 7.5 Create get_priority_fee tool
  - Define tool with no input parameters
  - Construct API URL as /fees/priority
  - Create AbortController with 15-second timeout
  - Fetch priority fee data from API
  - Handle non-200 responses with status and body
  - Handle timeout with "Request timed out" message
  - Return formatted JSON response
  - _Requirements: 8.1-8.7_

- [ ] 7.6 Create create_wallet tool
  - Define tool with wordlistSize input schema (12, 15, 18, 21, or 24)
  - Map wordlistSize to entropy strength (128, 160, 192, 224, or 256 bits)
  - Generate BIP-39 mnemonic using English wordlist
  - Derive account from mnemonic at path m/44'/60'/0'/0/0
  - Return JSON with mnemonic and address
  - Handle errors with "Failed to create wallet" message
  - _Requirements: 4.1-4.10_

- [ ] 7.7 Create sign_certificate tool
  - Define tool with purpose, payload, domain, and timestamp input schema
  - Validate AGENT_SECRET_KEY is set
  - Convert private key to account
  - Create certificate object with purpose, payload, timestamp, domain, and signer
  - Convert certificate to JSON string
  - Sign message using account.signMessage
  - Return JSON with certificate and signature
  - _Requirements: 9.1-9.12_

- [ ] 7.8 Create sign_raw_transaction tool
  - Define tool with rawTransaction input schema
  - Validate AGENT_SECRET_KEY is set
  - Convert private key to account
  - Parse raw transaction using parseTransaction
  - Sign transaction using account.signTransaction
  - Return JSON with signedTransaction and from address
  - Handle errors with reason field
  - _Requirements: 10.1-10.7_

- [ ] 7.9 Export somniaTools array
  - Export array containing all custom tool definitions
  - Ensure each tool follows SomniaTool interface
  - _Requirements: 5.1-10.7_

- [ ] 8. Implement GOAT SDK tools integration
  - Create toolsPromise async function that calls getOnChainTools
  - Pass viem wallet client wrapped with viem() adapter
  - Pass empty plugins array
  - Return listOfTools and toolHandler functions
  - Handle initialization errors with console.error and throw
  - _Requirements: 12.1-12.6_

- [ ] 9. Implement MCP server creation and tool registration
- [ ] 9.1 Create createSomniaServer function
  - Initialize McpServer with name "somnia-mcp-server" and version "1.0.0"
  - Set capabilities with tools object
  - _Requirements: 1.1_

- [ ] 9.2 Register GOAT SDK tools
  - Await toolsPromise to get listOfTools and toolHandler
  - Call listOfTools() to get array of tools
  - Build Zod schema map using buildToolZodMap
  - Iterate through each GOAT tool
  - Extract input shape from Zod schema (handle ZodObject _def.shape)
  - Register tool with server using name, title, description, and inputSchema
  - Implement callback that parses args with parseToolInput and calls toolHandler
  - Format result as JSON text content
  - _Requirements: 12.7-12.12_

- [ ] 9.3 Register custom Somnia tools
  - Iterate through somniaTools array
  - Register each tool with server using name, title, description, and inputSchema
  - Implement callback that invokes tool's callback function
  - Map result content to text type
  - _Requirements: 5.1-11.8_

- [ ] 9.4 Return configured server
  - Return server instance with all tools registered
  - _Requirements: 1.1_

- [ ] 10. Implement server startup and transport management
- [ ] 10.1 Create start function with environment detection
  - Read USE_STREAMABLE_HTTP environment variable
  - Set useStdIO flag as opposite of useStreamHttp
  - Read PORT (default 3000) and HOST (default 0.0.0.0) variables
  - Call createSomniaServer to get server instance
  - _Requirements: 1.2, 1.3, 2.7_

- [ ] 10.2 Implement STDIO mode
  - When useStdIO is true, create StdioServerTransport
  - Connect server to STDIO transport
  - Return without console.log output
  - _Requirements: 1.2, 1.4_

- [ ] 10.3 Implement HTTP mode with Express setup
  - When useStreamHttp is true, create Express app
  - Add express.json() middleware
  - Configure CORS with origin "*" and allowedHeaders ["Content-Type", "mcp-session-id"]
  - _Requirements: 1.3, 1.8_

- [ ] 10.4 Implement POST /mcp endpoint
  - Create POST /mcp route handler
  - Create StreamableHTTPServerTransport with DNS rebinding protection
  - Register res "close" event to cleanup transport and server
  - Connect server to transport
  - Call transport.handleRequest with req, res, and req.body
  - Handle errors with JSON-RPC error response (code -32603)
  - _Requirements: 1.5_

- [ ] 10.5 Implement GET and DELETE /mcp endpoints
  - Create GET /mcp route that returns 405 with JSON-RPC error (code -32000)
  - Create DELETE /mcp route that returns 405 with JSON-RPC error (code -32000)
  - _Requirements: 1.7_

- [ ] 10.6 Implement health check endpoint
  - Create GET /health route that returns 200 status with "ok" text
  - _Requirements: 1.6_

- [ ] 10.7 Start HTTP server
  - Call app.listen with port and host
  - Log server URL and environment mode to console
  - _Requirements: 1.3_

- [ ] 11. Implement application entry point
  - Create src/index.ts that resolves __dirname from import.meta.url
  - Temporarily override console.log to suppress dotenv output
  - Load .env file from project root
  - Restore console.log
  - Call start() function with catch handler
  - Log fatal errors to console.error and exit with code 1
  - _Requirements: 1.9, 2.1, 2.2_

- [ ] 12. Create Docker configuration
  - Create Dockerfile with node:lts-alpine base image
  - Set working directory to /app
  - Enable corepack and prepare pnpm
  - Accept AGENT_SECRET_KEY as build argument
  - Set default environment variables (ENVIRONMENT=MAINNET, USE_STREAMABLE_HTTP=true, PORT=3000, HOST=127.0.0.1)
  - Copy package files and tsconfig.json
  - Run pnpm install with --ignore-scripts
  - Copy all source files
  - Run pnpm run build
  - Expose port 3000
  - Set CMD to node ./dist/index.js
  - _Requirements: 17.1-17.14_

- [ ] 13. Create Smithery deployment configuration
  - Create smithery.yaml with runtime "container"
  - Specify dockerfile path and build context
  - Set environment variables (ENVIRONMENT=TESTNET, USE_STREAMABLE_HTTP=true, PORT=3000, HOST=0.0.0.0)
  - Add comment to set AGENT_SECRET_KEY via dashboard
  - Set startCommand type to "http"
  - _Requirements: 23.1-23.8_

- [ ] 14. Create README documentation
  - Write project description and features list
  - Document prerequisites (Node.js 18+, pnpm 10.14.0+)
  - Document installation instructions with pnpm install and build
  - Document usage for development (pnpm dev) and production (pnpm build, pnpm start)
  - Document environment variables with .env.example reference
  - Document network information for mainnet and testnet (chain IDs, RPC URLs, explorers)
  - Document project structure overview
  - Document Docker build and run commands
  - Document deployment references
  - Document security considerations (private key handling, secret management)
  - Document troubleshooting section (build errors, connection issues, signing failures)
  - Add links to Somnia resources (docs, explorer, Discord, Twitter)
  - _Requirements: 20.1-20.12_

- [ ] 15. Create MCP client configuration examples
  - Create somnia-mcp-stdio.example.json with STDIO mode configuration
  - Create somnia-mcp-streamable-http.json with HTTP mode configuration
  - Include command and arguments structure
  - Reference environment variable requirements
  - _Requirements: 24.1-24.4_

- [ ] 16. Create documentation site files
  - Create docs/index.html with documentation interface
  - Add docs/favicon.ico
  - Create docs/images folder with somnia.png and somniabg.png
  - _Requirements: 21.1-21.5_

- [ ] 17. Install dependencies and verify build
  - Run pnpm install to install all dependencies
  - Run pnpm build to compile TypeScript
  - Verify dist/index.js is created and executable
  - Run pnpm clean to test cleanup script
  - _Requirements: 16.1-16.14, 15.5, 15.9_

- [ ] 18. Write unit tests for schema utilities
  - Create test file for utils.ts
  - Test jsonSchemaPropToZod with enum, const, string, number, integer, boolean, array, and object types
  - Test jsonSchemaToZodRoot with object schemas and required fields
  - Test buildToolZodMap with sample tool list
  - Test parseToolInput with valid and invalid inputs
  - _Requirements: 13.1-13.12_

- [ ] 19. Write integration tests for tool execution
  - Create test file for tools.ts
  - Mock API responses for get_account, get_transaction, get_block, get_priority_fee
  - Test each custom tool callback with valid inputs
  - Test error handling for timeout and API errors
  - Test wallet creation with different wordlist sizes
  - Test certificate signing with test private key
  - Test raw transaction signing with test transaction
  - _Requirements: 4.1-11.8_

- [ ] 20. Write integration tests for server initialization
  - Create test file for server.ts
  - Test createSomniaServer function creates server with tools
  - Test GOAT SDK tool registration
  - Test custom tool registration
  - Mock wallet client and environment variables
  - _Requirements: 12.1-12.12_

- [ ] 21. Create end-to-end test for STDIO mode
  - Create test that spawns server process in STDIO mode
  - Send MCP protocol messages via stdin
  - Verify tool list response
  - Call a simple tool and verify response
  - Test server shutdown
  - _Requirements: 1.2, 1.4_

- [ ] 22. Create end-to-end test for HTTP mode
  - Create test that starts server in HTTP mode
  - Test GET /health endpoint returns 200
  - Test POST /mcp with tool list request
  - Test POST /mcp with tool call request
  - Test GET /mcp returns 405
  - Test DELETE /mcp returns 405
  - Test server shutdown
  - _Requirements: 1.3, 1.5, 1.6, 1.7_

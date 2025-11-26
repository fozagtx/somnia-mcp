# Requirements Document

## Introduction

This document outlines the requirements for creating an exact replica of the Somnia MCP Server - a Model Context Protocol (MCP) server implementation that enables AI agents like Claude to interact with the Somnia blockchain network. The server provides blockchain query capabilities, wallet management, cryptographic signing operations, documentation search, and on-chain tools via the GOAT SDK. It supports both STDIO and Streamable HTTP transport modes for flexible deployment scenarios.

## Requirements

### Requirement 1: MCP Server Core Infrastructure

**User Story:** As a developer, I want to set up a Model Context Protocol server with dual transport modes, so that I can deploy it in different environments (local STDIO or HTTP-based).

#### Acceptance Criteria

1. WHEN the server starts THEN it SHALL initialize an MCP server with name "somnia-mcp-server" and version "1.0.0"
2. WHEN the environment variable USE_STREAMABLE_HTTP is "false" or unset THEN the server SHALL use StdioServerTransport
3. WHEN the environment variable USE_STREAMABLE_HTTP is "true" THEN the server SHALL use StreamableHTTPServerTransport on the configured PORT and HOST
4. WHEN running in STDIO mode THEN the server SHALL NOT output any console.log messages to stdout to avoid breaking JSON-RPC protocol
5. WHEN running in HTTP mode THEN the server SHALL expose POST /mcp endpoint for MCP requests
6. WHEN running in HTTP mode THEN the server SHALL expose GET /health endpoint returning 200 status with "ok" response
7. WHEN running in HTTP mode THEN the server SHALL reject GET and DELETE requests to /mcp with 405 Method Not Allowed
8. WHEN running in HTTP mode THEN the server SHALL enable CORS with origin "*" and allowed headers ["Content-Type", "mcp-session-id"]
9. WHEN the server encounters a fatal error during startup THEN it SHALL log the error and exit with code 1

### Requirement 2: Environment Configuration Management

**User Story:** As a system administrator, I want to configure the server through environment variables, so that I can deploy it to different networks and environments without code changes.

#### Acceptance Criteria

1. WHEN the server starts THEN it SHALL load environment variables from a .env file in the project root
2. WHEN loading .env THEN it SHALL suppress dotenv console output to maintain STDIO compatibility
3. WHEN ENVIRONMENT is set to "MAINNET" THEN the server SHALL use Somnia mainnet configuration (Chain ID: 5031, RPC: https://api.infra.mainnet.somnia.network/)
4. WHEN ENVIRONMENT is set to "TESTNET" or any other value THEN the server SHALL use Somnia testnet configuration (Chain ID: 50312, RPC: https://dream-rpc.somnia.network/)
5. WHEN AGENT_SECRET_KEY is not provided THEN the server SHALL throw an error indicating the missing variable
6. WHEN AGENT_SECRET_KEY does not match the pattern ^0x[0-9a-fA-F]{64}$ THEN the server SHALL throw an error indicating invalid format
7. WHEN USE_STREAMABLE_HTTP is "true" THEN the server SHALL read PORT (default: 3000) and HOST (default: 0.0.0.0) variables
8. WHEN the server initializes THEN it SHALL provide an .env.example template file with all required variables

### Requirement 3: Wallet and Account Management

**User Story:** As a blockchain developer, I want to manage Ethereum-compatible wallets and accounts, so that I can sign transactions and interact with the Somnia blockchain.

#### Acceptance Criteria

1. WHEN the server initializes THEN it SHALL create a viem wallet client using the AGENT_SECRET_KEY private key
2. WHEN creating the wallet client THEN it SHALL configure it with the appropriate Somnia chain definition (mainnet or testnet)
3. WHEN the chain is mainnet THEN it SHALL use chain ID 5031, native currency STT with 18 decimals, and block explorer https://somniascan.io
4. WHEN the chain is testnet THEN it SHALL use chain ID 50312, native currency STT with 18 decimals, block explorer https://testnet.somniascan.io, and testnet flag true
5. WHEN the wallet client is created THEN it SHALL use HTTP transport with the configured RPC URL
6. WHEN the private key is converted to an account THEN it SHALL derive the Ethereum-compatible address
7. WHEN the wallet client is initialized THEN it SHALL be available for signing operations and on-chain tool execution

### Requirement 4: Wallet Creation Tool

**User Story:** As an AI agent, I want to create new Somnia wallets with BIP-39 mnemonics, so that users can generate secure wallet credentials.

#### Acceptance Criteria

1. WHEN the create_wallet tool is called THEN it SHALL generate a BIP-39 mnemonic using the English wordlist
2. WHEN wordlistSize parameter is 12 THEN it SHALL use 128-bit entropy
3. WHEN wordlistSize parameter is 15 THEN it SHALL use 160-bit entropy
4. WHEN wordlistSize parameter is 18 THEN it SHALL use 192-bit entropy
5. WHEN wordlistSize parameter is 21 THEN it SHALL use 224-bit entropy
6. WHEN wordlistSize parameter is 24 THEN it SHALL use 256-bit entropy
7. WHEN wordlistSize is not provided THEN it SHALL default to 12 words
8. WHEN the mnemonic is generated THEN it SHALL derive the account at standard path m/44'/60'/0'/0/0
9. WHEN the wallet is created THEN it SHALL return JSON containing mnemonic and address fields
10. WHEN wallet creation fails THEN it SHALL return an error object with error and reason fields

### Requirement 5: Blockchain Account Query Tool

**User Story:** As an AI agent, I want to retrieve account information from the Somnia blockchain, so that I can check balances and contract details.

#### Acceptance Criteria

1. WHEN the get_account tool is called THEN it SHALL accept an address parameter (20-byte hex with or without 0x prefix)
2. WHEN the address does not match the pattern ^(0x)?[0-9a-fA-F]{40}$ THEN it SHALL reject with validation error
3. WHEN the address is provided THEN it SHALL normalize it to lowercase with 0x prefix
4. WHEN revision parameter is provided THEN it SHALL accept "best", "justified", "finalized", a block number, or block ID
5. WHEN revision is not provided THEN it SHALL default to "best"
6. WHEN making the API request THEN it SHALL use the appropriate base URL (mainnet or testnet)
7. WHEN making the API request THEN it SHALL construct URL as /accounts/{address}?revision={revision}
8. WHEN making the API request THEN it SHALL set an abort timeout of 15 seconds
9. WHEN the API responds with non-200 status THEN it SHALL return error with status, statusText, and response body
10. WHEN the API returns null data THEN it SHALL return a message indicating account not found
11. WHEN the API request times out THEN it SHALL return error "Request timed out"
12. WHEN the API request succeeds THEN it SHALL return the account data as formatted JSON

### Requirement 6: Transaction Query Tool

**User Story:** As an AI agent, I want to retrieve transaction details from the Somnia blockchain, so that I can verify transaction status and contents.

#### Acceptance Criteria

1. WHEN the get_transaction tool is called THEN it SHALL accept an id parameter (0x-prefixed 32-byte hex)
2. WHEN the id does not match the pattern ^0x[0-9a-fA-F]{64}$ THEN it SHALL reject with validation error
3. WHEN pending parameter is true THEN it SHALL include pending transactions in the query
4. WHEN pending parameter is false or omitted THEN it SHALL default to false
5. WHEN raw parameter is true THEN it SHALL request raw hex transaction data
6. WHEN raw parameter is false or omitted THEN it SHALL default to false
7. WHEN head parameter is provided THEN it SHALL pin the query to that head block ID
8. WHEN making the API request THEN it SHALL construct URL as /transactions/{id} with query parameters
9. WHEN making the API request THEN it SHALL set an abort timeout of 15 seconds
10. WHEN the API returns null data THEN it SHALL return a message indicating transaction not found
11. WHEN the API request times out THEN it SHALL return error "Request timed out"
12. WHEN the API request succeeds THEN it SHALL return the transaction data as formatted JSON

### Requirement 7: Block Query Tool

**User Story:** As an AI agent, I want to retrieve block information from the Somnia blockchain, so that I can analyze blockchain state and history.

#### Acceptance Criteria

1. WHEN the get_block tool is called THEN it SHALL accept a revision parameter (block ID, number, or keywords)
2. WHEN revision is "best", "justified", or "finalized" THEN it SHALL use those keywords
3. WHEN revision is a number THEN it SHALL use it as a block number
4. WHEN revision is a string THEN it SHALL use it as a block ID
5. WHEN revision is not provided THEN it SHALL default to "best"
6. WHEN expanded parameter is true THEN it SHALL request transactions as objects instead of IDs
7. WHEN expanded parameter is false or omitted THEN it SHALL default to false
8. WHEN raw parameter is true THEN it SHALL request RLP-encoded block data
9. WHEN raw parameter is false or omitted THEN it SHALL default to false
10. WHEN making the API request THEN it SHALL construct URL as /blocks/{revision} with query parameters
11. WHEN making the API request THEN it SHALL set an abort timeout of 15 seconds
12. WHEN the API returns null data THEN it SHALL return a message indicating block not found
13. WHEN the API request succeeds THEN it SHALL return the block data as formatted JSON

### Requirement 8: Priority Fee Query Tool

**User Story:** As an AI agent, I want to get suggested priority fees for transactions, so that I can optimize transaction inclusion in upcoming blocks.

#### Acceptance Criteria

1. WHEN the get_priority_fee tool is called THEN it SHALL not require any input parameters
2. WHEN making the API request THEN it SHALL use the appropriate base URL (mainnet or testnet)
3. WHEN making the API request THEN it SHALL construct URL as /fees/priority
4. WHEN making the API request THEN it SHALL set an abort timeout of 15 seconds
5. WHEN the API request times out THEN it SHALL return error "Request timed out"
6. WHEN the API request fails THEN it SHALL return error with reason
7. WHEN the API request succeeds THEN it SHALL return the priority fee data as formatted JSON

### Requirement 9: Certificate Signing Tool

**User Story:** As an AI agent, I want to create and sign canonical certificates, so that I can provide cryptographic attestations and verifications.

#### Acceptance Criteria

1. WHEN the sign_certificate tool is called THEN it SHALL require AGENT_SECRET_KEY environment variable
2. WHEN AGENT_SECRET_KEY is not set THEN it SHALL throw an error
3. WHEN purpose parameter is provided THEN it SHALL accept "identification", "attestation", or "verification"
4. WHEN purpose is not provided THEN it SHALL default to "identification"
5. WHEN payload parameter is provided THEN it SHALL accept any type (string or JSON)
6. WHEN domain parameter is provided THEN it SHALL be a non-empty string
7. WHEN timestamp parameter is provided THEN it SHALL be a positive integer
8. WHEN timestamp is not provided THEN it SHALL default to current Unix timestamp (seconds)
9. WHEN creating the certificate THEN it SHALL include purpose, payload, timestamp, domain, and signer address
10. WHEN signing the certificate THEN it SHALL convert the certificate data to JSON string
11. WHEN signing the certificate THEN it SHALL use the account's signMessage method
12. WHEN signing succeeds THEN it SHALL return JSON with certificate object and signature

### Requirement 10: Raw Transaction Signing Tool

**User Story:** As an AI agent, I want to sign raw Ethereum transactions, so that I can prepare transactions for broadcast to the Somnia network.

#### Acceptance Criteria

1. WHEN the sign_raw_transaction tool is called THEN it SHALL require AGENT_SECRET_KEY environment variable
2. WHEN AGENT_SECRET_KEY is not set THEN it SHALL throw an error
3. WHEN rawTransaction parameter is provided THEN it SHALL be a hex string
4. WHEN signing the transaction THEN it SHALL parse the raw transaction using viem's parseTransaction
5. WHEN signing the transaction THEN it SHALL use the account's signTransaction method
6. WHEN signing succeeds THEN it SHALL return JSON with signedTransaction and from address
7. WHEN signing fails THEN it SHALL return error with reason

### Requirement 11: Documentation Search Tool

**User Story:** As an AI agent, I want to search Somnia documentation, so that I can find relevant information, code examples, and API references.

#### Acceptance Criteria

1. WHEN the search_documentation tool is called THEN it SHALL accept a query string parameter
2. WHEN searching THEN it SHALL connect to the Somnia Docs MCP server at https://docs.somnia.network/~gitbook/mcp
3. WHEN connecting to docs server THEN it SHALL use StreamableHTTPClientTransport
4. WHEN connecting to docs server THEN it SHALL use client name "somnia-docs-client" and version "1.0.0"
5. WHEN the connection is established THEN it SHALL call the searchDocumentation tool with the query
6. WHEN the search succeeds THEN it SHALL return the response as formatted JSON
7. WHEN the search times out THEN it SHALL return error "Request timed out"
8. WHEN the search fails THEN it SHALL return error with reason

### Requirement 12: GOAT SDK On-Chain Tools Integration

**User Story:** As an AI agent, I want to execute on-chain operations through GOAT SDK tools, so that I can interact with smart contracts and perform blockchain transactions.

#### Acceptance Criteria

1. WHEN the server initializes THEN it SHALL call getOnChainTools from @goat-sdk/adapter-model-context-protocol
2. WHEN initializing GOAT tools THEN it SHALL provide the viem wallet client
3. WHEN initializing GOAT tools THEN it SHALL provide an empty plugins array
4. WHEN GOAT tools initialization fails THEN it SHALL log the error and throw
5. WHEN GOAT tools are initialized THEN it SHALL retrieve the listOfTools function
6. WHEN GOAT tools are initialized THEN it SHALL retrieve the toolHandler function
7. WHEN registering GOAT tools THEN it SHALL iterate through all tools from listOfTools()
8. WHEN registering each GOAT tool THEN it SHALL convert its JSON schema to Zod schema
9. WHEN registering each GOAT tool THEN it SHALL extract the input shape from the Zod schema
10. WHEN a GOAT tool is called THEN it SHALL parse the input arguments using the tool's Zod schema
11. WHEN a GOAT tool is called THEN it SHALL invoke toolHandler with the tool name and parsed arguments
12. WHEN a GOAT tool execution succeeds THEN it SHALL return the result as formatted JSON text content

### Requirement 13: JSON Schema to Zod Conversion Utilities

**User Story:** As a developer, I want to convert JSON schemas to Zod schemas, so that I can validate tool inputs consistently.

#### Acceptance Criteria

1. WHEN converting a JSON schema with enum THEN it SHALL create a Zod union of literals
2. WHEN converting a JSON schema with const THEN it SHALL create a Zod literal
3. WHEN converting a string type THEN it SHALL apply minLength, maxLength, and pattern constraints
4. WHEN converting a number type THEN it SHALL apply minimum and maximum constraints
5. WHEN converting an integer type THEN it SHALL create a Zod number with int() constraint
6. WHEN converting a boolean type THEN it SHALL create a Zod boolean
7. WHEN converting an array type THEN it SHALL recursively convert the items schema and apply minItems/maxItems
8. WHEN converting an object type THEN it SHALL recursively convert all properties
9. WHEN converting an object type THEN it SHALL mark properties as optional if not in required array
10. WHEN converting an object with additionalProperties true THEN it SHALL use passthrough()
11. WHEN building a tool Zod map THEN it SHALL create a Map of tool names to Zod schemas
12. WHEN parsing tool input THEN it SHALL validate against the tool's Zod schema and throw detailed errors on failure

### Requirement 14: TypeScript Build Configuration

**User Story:** As a developer, I want to build the TypeScript project to JavaScript, so that I can run it in Node.js environments.

#### Acceptance Criteria

1. WHEN building the project THEN it SHALL use TypeScript compiler with target ES2022
2. WHEN building the project THEN it SHALL use module format ESNext
3. WHEN building the project THEN it SHALL use moduleResolution "bundler"
4. WHEN building the project THEN it SHALL enable esModuleInterop
5. WHEN building the project THEN it SHALL enable strict mode
6. WHEN building the project THEN it SHALL output to ./dist directory
7. WHEN building the project THEN it SHALL use ./src as root directory
8. WHEN building the project THEN it SHALL resolve JSON modules
9. WHEN building the project THEN it SHALL skip library checks
10. WHEN the build completes THEN it SHALL make dist/index.js executable (chmod 0o755)

### Requirement 15: Package Management and Scripts

**User Story:** As a developer, I want to manage dependencies and run common tasks through npm scripts, so that I can develop, build, and deploy the server efficiently.

#### Acceptance Criteria

1. WHEN package.json is defined THEN it SHALL specify package name "@somnia/mcp-server"
2. WHEN package.json is defined THEN it SHALL specify version "1.0.0"
3. WHEN package.json is defined THEN it SHALL specify type "module" for ES modules
4. WHEN package.json is defined THEN it SHALL specify main entry point as "./dist/index.js"
5. WHEN running "pnpm build" THEN it SHALL compile TypeScript and make index.js executable
6. WHEN running "pnpm start" THEN it SHALL execute node ./dist/index.js
7. WHEN running "pnpm dev" THEN it SHALL run the MCP inspector with tsx src/index.ts
8. WHEN running "pnpm dev:server" THEN it SHALL run tsx src/index.ts directly
9. WHEN running "pnpm clean" THEN it SHALL remove the dist directory
10. WHEN package.json is defined THEN it SHALL specify packageManager as "pnpm@10.14.0"
11. WHEN package.json is defined THEN it SHALL include files array with "dist"

### Requirement 16: Dependency Management

**User Story:** As a developer, I want all required dependencies installed, so that the server can function with all necessary libraries.

#### Acceptance Criteria

1. WHEN dependencies are installed THEN it SHALL include @goat-sdk/adapter-model-context-protocol version 0.2.11
2. WHEN dependencies are installed THEN it SHALL include @goat-sdk/core version 0.5.0
3. WHEN dependencies are installed THEN it SHALL include @goat-sdk/wallet-viem version 0.3.0
4. WHEN dependencies are installed THEN it SHALL include @modelcontextprotocol/sdk version 1.18.2
5. WHEN dependencies are installed THEN it SHALL include cors version 2.8.5
6. WHEN dependencies are installed THEN it SHALL include dotenv version 17.2.3
7. WHEN dependencies are installed THEN it SHALL include express version 5.1.0
8. WHEN dependencies are installed THEN it SHALL include viem version 2.37.11
9. WHEN dependencies are installed THEN it SHALL include zod version 3.25.76
10. WHEN dev dependencies are installed THEN it SHALL include @types/cors version 2.8.19
11. WHEN dev dependencies are installed THEN it SHALL include @types/express version 5.0.3
12. WHEN dev dependencies are installed THEN it SHALL include @types/node version 24.5.2
13. WHEN dev dependencies are installed THEN it SHALL include tsx version 4.20.5
14. WHEN dev dependencies are installed THEN it SHALL include typescript version 5.9.2

### Requirement 17: Docker Containerization

**User Story:** As a DevOps engineer, I want to containerize the server with Docker, so that I can deploy it consistently across different environments.

#### Acceptance Criteria

1. WHEN building the Docker image THEN it SHALL use node:lts-alpine as base image
2. WHEN building the Docker image THEN it SHALL set working directory to /app
3. WHEN building the Docker image THEN it SHALL enable corepack and prepare pnpm
4. WHEN building the Docker image THEN it SHALL accept AGENT_SECRET_KEY as build argument
5. WHEN building the Docker image THEN it SHALL set ENVIRONMENT to "MAINNET" by default
6. WHEN building the Docker image THEN it SHALL set USE_STREAMABLE_HTTP to "true" by default
7. WHEN building the Docker image THEN it SHALL set PORT to 3000 by default
8. WHEN building the Docker image THEN it SHALL set HOST to "127.0.0.1" by default
9. WHEN building the Docker image THEN it SHALL copy package files and tsconfig.json
10. WHEN building the Docker image THEN it SHALL run pnpm install with --ignore-scripts
11. WHEN building the Docker image THEN it SHALL copy all source files
12. WHEN building the Docker image THEN it SHALL run pnpm run build
13. WHEN building the Docker image THEN it SHALL expose port 3000
14. WHEN running the container THEN it SHALL execute node ./dist/index.js

### Requirement 18: Configuration Constants

**User Story:** As a developer, I want centralized configuration constants, so that I can maintain consistent settings across the application.

#### Acceptance Criteria

1. WHEN configuration is loaded THEN it SHALL define CONTROLLER_ABORT_TIMEOUT_MS as 15000
2. WHEN configuration is loaded THEN it SHALL define ADDRESS_REGEX as /^(0x)?[0-9a-fA-F]{40}$/
3. WHEN configuration is loaded THEN it SHALL define TXID_REGEX as /^0x[0-9a-fA-F]{64}$/
4. WHEN configuration is loaded THEN it SHALL define MCP_CLIENT_NAME as "somnia-docs-client"
5. WHEN configuration is loaded THEN it SHALL define MCP_CLIENT_VERSION as "1.0.0"
6. WHEN configuration is loaded THEN it SHALL define SOMNIA_DOCS_URL as "https://docs.somnia.network/"
7. WHEN configuration is loaded THEN it SHALL define MCP_SERVER_NAME as "somnia-mcp-server"
8. WHEN configuration is loaded THEN it SHALL define MCP_SERVER_VERSION as "1.0.0"
9. WHEN configuration is loaded THEN it SHALL define MAINNET_RPC_URL as "https://api.infra.mainnet.somnia.network/"
10. WHEN configuration is loaded THEN it SHALL define TESTNET_RPC_URL as "https://dream-rpc.somnia.network/"
11. WHEN configuration is loaded THEN it SHALL define MAINNET_CHAIN_ID as 5031
12. WHEN configuration is loaded THEN it SHALL define TESTNET_CHAIN_ID as 50312
13. WHEN configuration is loaded THEN it SHALL export somniaConfig object with general, mainnet, testnet, mcpClient, and mcpServer sections

### Requirement 19: Type Definitions

**User Story:** As a developer, I want TypeScript type definitions for core data structures, so that I can maintain type safety throughout the application.

#### Acceptance Criteria

1. WHEN types are defined THEN it SHALL export REVISION enum with Best, Justified, and Finalized values
2. WHEN types are defined THEN it SHALL export SomniaTool interface with name, title, description, inputSchema, and callback properties
3. WHEN SomniaTool interface is used THEN inputSchema SHALL be a Record of string to ZodTypeAny
4. WHEN SomniaTool interface is used THEN callback SHALL return a Promise of content array with type and text properties

### Requirement 20: Documentation and Deployment Guides

**User Story:** As a user, I want comprehensive documentation, so that I can understand, install, configure, and deploy the server.

#### Acceptance Criteria

1. WHEN README.md exists THEN it SHALL include project description and features list
2. WHEN README.md exists THEN it SHALL include prerequisites (Node.js 18+, pnpm 10.14.0+)
3. WHEN README.md exists THEN it SHALL include installation instructions
4. WHEN README.md exists THEN it SHALL include usage instructions for development and production modes
5. WHEN README.md exists THEN it SHALL include configuration section with environment variables
6. WHEN README.md exists THEN it SHALL include network information for mainnet and testnet
7. WHEN README.md exists THEN it SHALL include project structure overview
8. WHEN README.md exists THEN it SHALL include Docker support instructions
9. WHEN README.md exists THEN it SHALL include deployment references
10. WHEN README.md exists THEN it SHALL include security considerations
11. WHEN README.md exists THEN it SHALL include troubleshooting section
12. WHEN README.md exists THEN it SHALL include links to Somnia resources

### Requirement 21: Static Documentation Site

**User Story:** As a user, I want a static HTML documentation site, so that I can access visual documentation and branding materials.

#### Acceptance Criteria

1. WHEN docs folder exists THEN it SHALL contain index.html file
2. WHEN docs folder exists THEN it SHALL contain favicon.ico
3. WHEN docs folder exists THEN it SHALL contain images folder with somnia.png and somniabg.png
4. WHEN index.html exists THEN it SHALL provide documentation interface
5. WHEN documentation site is deployed THEN it SHALL be hostable on GitHub Pages, Vercel, Netlify, or Surge

### Requirement 22: Git and Docker Ignore Patterns

**User Story:** As a developer, I want proper ignore patterns, so that sensitive files and build artifacts are not committed or included in Docker images.

#### Acceptance Criteria

1. WHEN .gitignore exists THEN it SHALL exclude node_modules, dist, .env, and common IDE files
2. WHEN .dockerignore exists THEN it SHALL exclude node_modules, dist, .env, .git, and documentation files
3. WHEN .gitignore exists THEN it SHALL include .env.example for reference
4. WHEN .dockerignore exists THEN it SHALL optimize Docker build context size

### Requirement 23: Smithery Deployment Configuration

**User Story:** As a DevOps engineer, I want Smithery deployment configuration, so that I can deploy the server to Smithery platform.

#### Acceptance Criteria

1. WHEN smithery.yaml exists THEN it SHALL specify runtime as "container"
2. WHEN smithery.yaml exists THEN it SHALL specify dockerfile path and build context
3. WHEN smithery.yaml exists THEN it SHALL set ENVIRONMENT to "TESTNET"
4. WHEN smithery.yaml exists THEN it SHALL set USE_STREAMABLE_HTTP to "true"
5. WHEN smithery.yaml exists THEN it SHALL set PORT to "3000"
6. WHEN smithery.yaml exists THEN it SHALL set HOST to "0.0.0.0"
7. WHEN smithery.yaml exists THEN it SHALL specify startCommand type as "http"
8. WHEN smithery.yaml exists THEN it SHALL include comment to set AGENT_SECRET_KEY via dashboard

### Requirement 24: MCP Configuration Examples

**User Story:** As a user, I want MCP client configuration examples, so that I can connect to the server from MCP clients.

#### Acceptance Criteria

1. WHEN somnia-mcp-stdio.example.json exists THEN it SHALL provide STDIO mode configuration example
2. WHEN somnia-mcp-streamable-http.json exists THEN it SHALL provide HTTP mode configuration example
3. WHEN configuration examples exist THEN they SHALL include proper command and arguments structure
4. WHEN configuration examples exist THEN they SHALL reference environment variable requirements

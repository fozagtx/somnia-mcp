# Somnia Monorepo

A monorepo containing the Somnia MCP Server and AI Agent for interacting with the Somnia blockchain.

## 📦 Packages

This monorepo contains the following packages:

### [`@somnia/mcp-server`](./packages/mcp-server)
Model Context Protocol (MCP) server that enables AI agents like Claude to interact with the Somnia blockchain network.

**Features:**
- 📚 Official Somnia documentation search
- 🔍 Blockchain queries (accounts, transactions, blocks)
- 💼 Wallet management and creation
- ✍️ Cryptographic signing operations
- 🤖 On-chain tools via GOAT SDK

### [`@somnia/agent`](./packages/agent)
AI agent built with ADK (Agent Development Kit) for autonomous interactions with Somnia blockchain.

**Features:**
- 🤖 Interactive chat interface
- 🔄 Advanced agent workflows
- 🔗 Integration with MCP tools
- 🎯 Custom agent implementations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 10.14.0+

### Installation

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build
```

---

## 📖 Usage

### MCP Server

```bash
# Build the MCP server
pnpm mcp:build

# Start the MCP server
pnpm mcp:start

# Run in development mode
pnpm mcp:dev
```

For detailed MCP server documentation, see [`packages/mcp-server/README.md`](./packages/mcp-server/README.md).

### Agent

```bash
# Build the agent
pnpm agent:build

# Start the agent
pnpm agent:start

# Run in development mode
pnpm agent:dev

# Interactive chat mode
pnpm agent:chat

# Advanced interactive mode
pnpm agent:interactive
```

For detailed agent documentation, see [`packages/agent/README.md`](./packages/agent/README.md).

---

## 🏗️ Monorepo Structure

```
somnia/
├── packages/
│   ├── mcp-server/          # MCP Server package
│   │   ├── src/             # Server source code
│   │   ├── dist/            # Built output
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── agent/               # AI Agent package
│       ├── src/             # Agent source code
│       ├── dist/            # Built output
│       ├── package.json
│       └── tsconfig.json
│
├── package.json             # Root workspace configuration
├── pnpm-workspace.yaml      # pnpm workspace definition
├── tsconfig.base.json       # Shared TypeScript config
└── README.md                # This file
```

---

## 🛠️ Development Scripts

### Root Level Commands

```bash
# Build all packages
pnpm build

# Run all packages in development mode (parallel)
pnpm dev

# Clean all build artifacts and node_modules
pnpm clean
```

### Package-Specific Commands

```bash
# MCP Server
pnpm mcp:build          # Build MCP server
pnpm mcp:start          # Start MCP server
pnpm mcp:dev            # Development mode

# Agent
pnpm agent:build        # Build agent
pnpm agent:start        # Start agent
pnpm agent:dev          # Development mode
pnpm agent:chat         # Interactive chat
pnpm agent:interactive  # Advanced interactive mode
```

---

## 🔧 Configuration

### Environment Variables

#### MCP Server
Create a `.env` file in `packages/mcp-server/`:

```bash
# Network Configuration
ENVIRONMENT=TESTNET              # or MAINNET

# Wallet Configuration (required for signing)
AGENT_SECRET_KEY=0x...          # Your private key

# Server Configuration
USE_STREAMABLE_HTTP=false       # true for HTTP mode
PORT=3000                       # HTTP server port
HOST=127.0.0.1                  # HTTP server host
```

#### Agent
Create a `.env` file in `packages/agent/` (see `packages/agent/.env.example`).

---

## 🌐 Network Information

### Mainnet
- **Chain ID:** 5031
- **RPC URL:** https://api.infra.mainnet.somnia.network/
- **Explorer:** https://somniascan.io
- **Native Token:** STT

### Testnet
- **Chain ID:** 50312
- **RPC URL:** https://dream-rpc.somnia.network/
- **Explorer:** https://testnet.somniascan.io
- **Native Token:** STT (Testnet)

---

## 📚 Resources

- 📖 [Somnia Documentation](https://docs.somnia.network/)
- 🔗 [Somnia Explorer](https://somniascan.io)
- 💬 [Somnia Discord](https://discord.gg/somnia)
- 🐦 [Somnia Twitter](https://twitter.com/somnianetwork)
- 📘 [Model Context Protocol](https://modelcontextprotocol.io/)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see individual package LICENSE files for details.

---

## 🔒 Security Considerations

⚠️ **Important Security Notes:**

1. **Private Keys:** Never commit your `AGENT_SECRET_KEY` to version control
2. **Environment Variables:** Use secure secret management for production
3. **API Access:** Limit MCP server access to trusted AI agents
4. **Testnet First:** Always test on Somnia Testnet before mainnet operations

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear all dependencies and rebuild
pnpm clean
pnpm install
pnpm build
```

### Connection Issues
- Verify RPC URLs are accessible
- Check network environment (MAINNET vs TESTNET)
- Ensure correct chain ID configuration

### Signing Failures
- Verify `AGENT_SECRET_KEY` is correctly formatted (0x prefix)
- Check private key has required permissions
- Ensure sufficient balance for gas fees
<div align="center">
  <p>Made with ❤️ for the Somnia ecosystem</p>
</div>

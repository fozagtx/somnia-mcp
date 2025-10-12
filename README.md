# Somnia MCP Server

<div align="center">
  <img src="https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1148605497-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FNV0f0sVU4bKoaMkJqaND%252Ficon%252FnXhtBF0vbZxvb28fCOXA%252Fsomnia-icon-white.png%3Falt%3Dmedia%26token%3D8c5cd2a0-8c84-46b9-855c-6ce84f4b6e52&width=32&dpr=2&quality=100&sign=74bacc5a&sv=1" alt="Somnia logo" width="140">
https://.somnia.network~gitbookimage?url=https%3A%2F%2F1148605497files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FNV0f0sVU4bKoaMkJqaND%252Ficon%252FnXhtBF0vbZxvb28fCOXA%252Fsomnia-icon-white%3Falt%3Dmedia%26token%3D8c5cd2a0-8c84-46b9-855c-6ce84f4b6e52&width=32&dpr=2&quality=100&sign=74bacc5a&sv=1Somnia
SomniaSomniaSomniahttps://.somnia.network~gitbookimage?url=https%3A%2F%2F1148605497files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FNV0f0sVU4bKoaMkJqaND%252Ficon%252FnXhtBF0vbZxvb28fCOXA%252Fsomnia-icon-white%3Falt%3Dmedia%26token%3D8c5cd2a0-8c84-46b9-855c-6ce84f4b6e52&width=32&dpr=2&quality=100&sign=74bacc5a&sv=1Somnia
SomniaSomniaSomnia</div>

<p align="center">
  <strong>Model Context Protocol Server for Somnia Blockchain</strong>
</p>

---

## Overview

**Somnia MCP Server** is a Model Context Protocol (MCP) server that enables AI agents like Claude to interact with the Somnia blockchain network. It acts as a bridge between AI assistants and Somnia's ecosystem, providing access to:

- 📚 Official Somnia documentation search
- 🔍 Blockchain queries (accounts, transactions, blocks)
- 💼 Wallet management and creation
- ✍️ Cryptographic signing operations
- 🤖 On-chain tools via GOAT SDK

### What is Somnia?

Somnia is a high-performance, cost-efficient **EVM-compatible Layer 1 blockchain** designed for scalability and speed. It supports standard Ethereum development tools and practices.

**Network Information:**
- **Mainnet Chain ID:** 5031
- **Testnet Chain ID:** 50312
- **Documentation:** https://docs.somnia.network/

---

## Features

### 📚 Documentation Tools
- **`search_documentation`** - Search across Somnia's official documentation to find guides, API references, code examples, and implementation details.

### 🔍 Blockchain Query Tools
- **`get_account`** - Retrieve account/contract details by address (balance, nonce, code)
- **`get_transaction`** - Get transaction details by ID (status, gas, block info)
- **`get_block`** - Fetch block information by block number, ID, or keywords (best/finalized/justified)
- **`get_priority_fee`** - Get suggested priority fee for transactions

### 💼 Wallet Management
- **`create_wallet`** - Generate new Ethereum-compatible wallets with BIP-39 mnemonic phrases (12/15/18/21/24 words)

### ✍️ Cryptographic Signing
- **`sign_message`** - Sign messages using EIP-191 standard
- **`sign_transaction`** - Sign Ethereum transactions for the Somnia network

### 🤖 GOAT SDK Tools (On-Chain Operations)
- `get_address` - Get wallet address
- `get_chain` - Get chain information
- `sign_message` - Sign messages with wallet
- `get_balance` - Get native or ERC20 token balance
- `get_token_info_by_ticker` - Get token info by ticker symbol
- `convert_to_base_units` - Convert to wei/base units
- `convert_from_base_units` - Convert from wei to human-readable
- `sign_typed_data_evm` - Sign EIP-712 typed data
- `get_token_allowance_evm` - Check ERC20 allowance
- `send_token` - Send native currency or ERC20 tokens
- `approve_token_evm` - Approve ERC20 token spending
- `revoke_token_approval_evm` - Revoke ERC20 approvals

---

## Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/somnia-mcp-server.git
   cd somnia-mcp-server
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```bash
   AGENT_SECRET_KEY=0x...  # Your private key (required for signing operations)
   ENVIRONMENT=MAINNET      # or TESTNET
   USE_STREAMABLE_HTTP=false
   PORT=3000                # Only needed for streamable-http mode
   HOST=0.0.0.0            # Only needed for streamable-http mode
   ```

4. **Build the project:**
   ```bash
   pnpm run build
   ```

5. **Start the server:**
   ```bash
   pnpm run start
   ```

---

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AGENT_SECRET_KEY` | Private key for signing operations (hex format with 0x prefix) | Yes* | - |
| `ENVIRONMENT` | Network environment | Yes | `MAINNET` |
| `USE_STREAMABLE_HTTP` | Server mode: `false` for stdio, `true` for HTTP | No | `false` |
| `PORT` | HTTP server port (streamable-http mode only) | No | `3000` |
| `HOST` | HTTP server host (streamable-http mode only) | No | `0.0.0.0` |

*Required only if you plan to use wallet signing tools (`sign_message`, `sign_transaction`)

### MCP Client Configuration

#### stdio Mode (Claude Desktop)

Add to your MCP settings file (`somnia-mcp-stdio.example.json`):

```json
{
  "mcpServers": {
    "somniaMcpStdio": {
      "command": "node",
      "type": "stdio",
      "args": [
        "/ABSOLUTE/PATH/TO/somnia-mcp-server/dist/index.js"
      ],
      "env": {
        "AGENT_SECRET_KEY": "<YOUR_AGENT_SECRET_KEY>",
        "ENVIRONMENT": "MAINNET",
        "USE_STREAMABLE_HTTP": "false"
      }
somniaMcpyourusernamesomniasomniaMcpyourusernamesomnia    }
  }
}
```

#### Streamable HTTP Mode (Web/Cloud Deployment)

```json
{
  "mcpServers": {
    "somniaMcpStreamableHttp": {
      "type": "streamable-http",
      "url": "<YOUR_MCP_URL>/mcp",
      "env": {
        "AGENT_SECRET_KEY": "<YOUR_AGENT_SECRET_KEY>",
        "ENVIRONMENT": "MAINNET",
        "USE_STREAMABLE_HTTP": "true",
        "PORT": "3000",
        "HOST": "127.0.0.1"
      }
    }
  }
}
```
Somnia
        - `search_documentation`: Search Somnia Documentation.
Somnia
        Somnia
        Somnia
        - `sign_message`: Sign a message using EIP-191 standard.
        - `sign_transaction`: Sign an Ethereum transaction.
Somnia
Somnia
        - `search_documentation`: Search Somnia Documentation.
Somnia
        Somnia
        Somnia
        - `sign_message`: Sign a message using EIP-191 standard.
        - `sign_transaction`: Sign an Ethereum transaction.
Somnia
---

## Network Information

### Mainnet
- **Chain ID**: 5031
- **RPC URL**: https://api.infra.mainnet.somnia.network/
- **Explorer**: https://somniascan.io
- **Native Token**: STT

### Testnet
- **Chain ID**: 50312
- **RPC URL**: https://dream-rpc.somnia.network/
- **Explorer**: https://testnet.somniascan.io
- **Native Token**: STT (Testnet)

---

## Development

### Run withSecretSecret Inspector (Development Mode)

For development and testing, use theMAINNET MCP Inspector:testnetTESTNET

```bash
pnpx @modelcontextprotocol/inspector pnpx tsx ./src/index.ts
```
This opens an interactive inspector UI where you can test all MCP tools.
### Build

```bash
pnpm run build
```

### Project Structure

```
somnia-mcp-server/
├── src/
│   ├── index.ts           # Entry point
│   ├── server.ts          # MCP server setup
│   ├── config.ts          # Network configuration
│   ├── tools.ts           # Tool definitions
│   ├── client.ts          # GitBook documentation client
│   ├── wallet.ts          # Wallet and chain setup
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── dist/                  # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

---

## Usage Examples

### Example 1: Search Documentation
```
AI: "How do I connect to Somnia using viem?"
→ Uses search_documentation tool
→ Returns relevant docs from docs.somnia.network
```

### Example 2: Check Account Balance
```
AI: "What's the balance of 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
→ Uses get_account tool
→ Returns balance, nonce, and account details
```

### Example 3: Monitor Transaction
```
AI: "Show me details of transaction 0xabc..."
→ Uses get_transaction tool
→ Returns transaction status, gas used, block number
```

### Example 4: Create New Wallet
```
AI: "Generate a new Somnia wallet with 12 words"
→ Uses create_wallet tool
→ Returns mnemonic phrase and address
```

---

## Network Information

### Mainnet
- **Chain ID:** 5031
- **RPC URL:** `https://api.infra.mainnet.somnia.network/`
- **Explorer:** https://somniascan.io
- **Native Token:** STT

### Testnet
- **Chain ID:** 50312
- **RPC URL:** `https://dream-rpc.somnia.network/`
- **Explorer:** https://testnet.somniascan.io
- **Native Token:** STT (Testnet)

---

## Deployment

### Deploy to Smithery.ai

1. Fork this repository to your GitHub account
2. Log in to [smithery.ai](https://smithery.ai/)
3. Click **"Publish server"**
4. Connect your forked repository
5. Add required environment variables in settings:
   - `AGENT_SECRET_KEY`
   - `ENVIRONMENT`
   - `USE_STREAMABLE_HTTP`
   - `PORT`
   - `HOST`
6. Complete the deployment steps

### Self-Hosting

You can deploy this MCP server to any Node.js hosting platform:
- **Vercel, Netlify, Railway:** Use streamable-http mode
- **AWS Lambda, Google Cloud Functions:** Adapt for serverless
- **Docker:** Build container and deploy to any cloud

---

## Security Considerations

⚠️ **Important Security Notes:**

1. **Private Keys**: Never commit your `AGENT_SECRET_KEY` to version control
2. **Environment Variables**: Use secure secret management for production
3. **API Access**: Limit MCP server access to trusted AI agents
4. **Signing Operations**: Review all transaction signatures before execution
5. **Testnet First**: Always test on Somnia Testnet before mainnet operations

---

## Technology Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Blockchain Library:** [viem](https://viem.sh) - Ethereum-compatible library
- **MCP SDK:** [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- **On-Chain Tools:** [@goat-sdk](https://github.com/goat-sdk/goat)
- **Documentation:** GitBook MCP integration

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Troubleshooting

### Common Issues

**Build errors:**
```bash
# Clear dependencies and rebuild
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm run build
```

**Connection issues:**
- Verify RPC URLs are accessible
- Check network environment (MAINNET vs TESTNET)
- Ensure correct chain ID configuration

**Signing failures:**
- Verify `AGENT_SECRET_KEY` is correctly formatted (0x prefix)
- Check private key has required permissions
- Ensure sufficient balance for gas fees

---

## Resources

- 📖 [Somnia Documentation](https://docs.somnia.network/)
- 🔗 [Somnia Explorer](https://somniascan.io)
- 💬 [Somnia Discord](https://discord.gg/somnia)
- 🐦 [Somnia Twitter](https://twitter.com/somnianetwork)
- 📘 [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- 📦 [Viem Documentation](https://viem.sh)

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Acknowledgments

- Built with the [Model Context Protocol](https://modelcontextprotocol.io/)
- Powered by [Somnia Network](https://somnia.network/)
- Blockchain interactions via [viem](https://viem.sh)
- On-chain tools via [GOAT SDK](https://github.com/goat-sdk/goat)

---

<div align="center">
  <p>Made with ❤️ for the Somnia ecosystem</p>
  <p>
    <a href="https://docs.somnia.network/">Documentation</a> •
    <a href="https://somniascan.io">Explorer</a> •
    <a href="https://discord.gg/somnia">Discord</a>
  </p>
</div>

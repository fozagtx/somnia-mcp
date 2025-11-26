# Somnia MCP Server

<div align="center">
  <img src="./docs/images/somnia.png" alt="Somnia Logo" width="200"/>
  
  <br/>
  <br/>
  
  [![Built with Amazon Q Developer](https://img.shields.io/badge/Built%20with-Amazon%20Q%20Developer%20%7C%20Kiro-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/q/developer/)
  
</div>

<br/>

Model Context Protocol (MCP) server that enables AI agents like Claude to interact with the Somnia blockchain network.

> **Built with Amazon Q Developer's Kiro** - This project was architected, designed, and documented using Kiro's AI-powered spec-driven development workflow, agent hooks, and intelligent code analysis. See [KIRO_DEVELOPMENT_PROCESS.md](./KIRO_DEVELOPMENT_PROCESS.md) for details.

## Features

- Official Somnia documentation search
- Blockchain queries (accounts, transactions, blocks)
- Wallet management and creation
- Cryptographic signing operations
- On-chain tools via GOAT SDK

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 10.14.0+

### Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build
```

---

## Usage

### Development Mode

```bash
# Run in development mode
pnpm dev
```

### Production Mode

```bash
# Build the project
pnpm build

# Start the server
pnpm start
```

### Testing

```bash
pnpm test
```

### Clean Build

```bash
# Remove build artifacts
pnpm clean
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

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

See `.env.example` for a template.

---

## Network Information

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

## Project Structure

```
somnia/
├── src/                  # Server source code
├── dist/                 # Built output
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore patterns
├── smithery.yaml         # Smithery configuration
├── somnia-mcp-stdio.example.json           # STDIO mode config
├── somnia-mcp-streamable-http.json         # HTTP mode config
└── README.md             # This file
```

---

## Docker Support

Build and run with Docker:

```bash
# Build Docker image
docker build -t somnia-mcp-server .

# Run container
docker run -p 3000:3000 --env-file .env somnia-mcp-server
```

---

## Deployment

### MCP Server

For deployment instructions to Smithery or other platforms, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

**Important:** Ensure `AGENT_SECRET_KEY` is set as an environment variable in your deployment platform, not hardcoded in the Dockerfile.

### Documentation Site

The `docs/` folder contains a static HTML documentation site. For hosting instructions, see **[docs/HOSTING.md](./docs/HOSTING.md)**.

**Quick Deploy:**
- GitHub Pages (recommended)
- Vercel: `vercel --prod`
- Netlify: Drag & drop at https://app.netlify.com/drop
- Surge: `cd docs && surge`

---

## Resources

- [Somnia Documentation](https://docs.somnia.network/)
- [Somnia Explorer](https://somniascan.io)
- [Somnia Discord](https://discord.gg/somnia)
- [Somnia Twitter](https://twitter.com/somnianetwork)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Amazon Q Developer](https://aws.amazon.com/q/developer/) - AI-powered development tool used to build this project

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License

---

## Security Considerations

**Important Security Notes:**

1. **Private Keys:** Never commit your `AGENT_SECRET_KEY` to version control
2. **Environment Variables:** Use secure secret management for production
3. **API Access:** Limit MCP server access to trusted AI agents
4. **Testnet First:** Always test on Somnia Testnet before mainnet operations

---

## Troubleshooting

### Build Errors

```bash
# Clear all dependencies and rebuild
pnpm clean
rm -rf node_modules pnpm-lock.yaml
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

---

<div align="center">
  <p>Made with ❤️ for the Somnia ecosystem</p>
  <p>Built with 🤖 <a href="https://aws.amazon.com/q/developer/">Amazon Q Developer | Kiro</a></p>
</div>

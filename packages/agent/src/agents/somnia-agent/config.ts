import type { McpConfig } from "@iqai/adk";
import path from "path";
import os from "os";
import fs from "fs";

// Directory for storing wallet data
export const WALLET_DATA_DIR = path.join(
  os.homedir(),
  ".somnia-agent",
  "wallets",
);

// Ensure wallet directory exists on module load
try {
  fs.mkdirSync(WALLET_DATA_DIR, { recursive: true });
} catch (error) {
  console.error("Failed to create wallet directory:", error);
}

// Filesystem MCP Server Configuration
export const filesystemMcpConfig: McpConfig = {
  name: "Filesystem MCP Client",
  description:
    "MCP client for filesystem operations to store and manage wallet data",
  transport: {
    mode: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", WALLET_DATA_DIR],
  },
};

// Somnia MCP Server Configuration
// From dist/agents/somnia-agent/config.js, go up 4 levels to reach packages/
// Then navigate to mcp-server/dist/index.js
const mcpServerPath = path.resolve(
  __dirname,
  "../../../../mcp-server/dist/index.js",
);

export const somniaMcpConfig: McpConfig = {
  name: "Somnia MCP Client",
  description:
    "MCP client for Somnia blockchain operations including wallet creation, queries, and signing",
  transport: {
    mode: "stdio",
    command: "node",
    args: [mcpServerPath],
    env: {
      ENVIRONMENT: process.env.ENVIRONMENT || "TESTNET",
      AGENT_SECRET_KEY: process.env.AGENT_SECRET_KEY || "",
      USE_STREAMABLE_HTTP: "false",
    },
  },
};

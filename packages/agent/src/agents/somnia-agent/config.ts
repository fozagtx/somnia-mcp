import type { McpConfig } from "@iqai/adk";
import path from "path";

// Telegram MCP Server Configuration
export const telegramMcpConfig: McpConfig = {
  name: "Telegram MCP Client",
  description:
    "MCP client for Telegram bot operations to send wallet details and notifications",
  transport: {
    mode: "stdio",
    command: "pnpm",
    args: ["dlx", "@iqai/mcp-telegram"],
    env: {
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
      PATH: process.env.PATH || "",
      // Disable sampling to avoid bot polling conflicts
      DISABLE_SAMPLING: "true",
    },
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

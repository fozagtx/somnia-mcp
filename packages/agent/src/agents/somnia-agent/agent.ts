import { LlmAgent, McpToolset } from "@iqai/adk";
import { env } from "../../env";
import {
  filesystemMcpConfig,
  somniaMcpConfig,
  WALLET_DATA_DIR,
} from "./config";
import { saveWalletTool, listWalletsTool, getWalletTool } from "./tools";

export const getSomniaAgent = async () => {
  // Initialize MCP toolsets
  const filesystemToolset = new McpToolset(filesystemMcpConfig);
  const somniaToolset = new McpToolset(somniaMcpConfig);
  // Get tools from MCP toolsets
  const filesystemTools = await filesystemToolset.getTools();
  const somniaTools = await somniaToolset.getTools();

  // Build the Somnia agent with all tools
  const agent = new LlmAgent({
    name: "somnia_agent",
    description:
      "Somnia blockchain agent for wallet management, blockchain queries, and file operations. " +
      "Can create wallets, store wallet data securely, query blockchain information, " +
      "and manage files in the wallet directory.",
    model: env.LLM_MODEL,
    tools: [
      ...filesystemTools,
      ...somniaTools,
      saveWalletTool,
      listWalletsTool,
      getWalletTool,
    ],
    instruction:
      "You are a helpful Somnia blockchain assistant. You can:\n" +
      "1. Create new wallets using the 'create_wallet' tool from Somnia MCP\n" +
      "2. Save wallet details securely to the filesystem using 'save_wallet'\n" +
      "3. List all saved wallets using 'list_wallets'\n" +
      "4. Retrieve specific wallet information using 'get_wallet'\n" +
      "5. Query blockchain data (accounts, transactions, blocks) using Somnia MCP tools\n" +
      "6. Search Somnia documentation using 'search_documentation'\n" +
      "7. Manage files in the wallet directory using filesystem tools\n\n" +
      `Wallet data is stored in: ${WALLET_DATA_DIR}\n\n` +
      "IMPORTANT: When creating a wallet:\n" +
      "1. First use 'create_wallet' from Somnia MCP to generate the wallet\n" +
      "2. Then IMMEDIATELY use 'save_wallet' to store the wallet details\n" +
      "3. Confirm to the user that the wallet has been saved securely\n\n" +
      "Always be helpful, clear, and security-conscious when handling wallet information.",
  });

  return agent;
};

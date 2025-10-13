import { LlmAgent, McpToolset } from "@iqai/adk";
import { env } from "../../env";
import { telegramMcpConfig, somniaMcpConfig } from "./config";
import { saveWalletTool } from "./tools";

export const getSomniaAgent = async () => {
  const telegramToolset = new McpToolset(telegramMcpConfig);
  const somniaToolset = new McpToolset(somniaMcpConfig);

  const telegramTools = await telegramToolset.getTools();
  const somniaTools = await somniaToolset.getTools();

  // Build the Somnia agent with all tools
  const agent = new LlmAgent({
    name: "somnia_agent",
    description:
      "Somnia blockchain agent for wallet management, blockchain queries, and Telegram notifications. " +
      "Can create wallets, send wallet details to Telegram, query blockchain information, " +
      "and send messages to Telegram channels.",
    model: env.LLM_MODEL,
    tools: [...telegramTools, ...somniaTools, saveWalletTool],
    instruction:
      "You are a helpful Somnia blockchain assistant. You can:\n" +
      "1. Create new wallets using the 'create_wallet' tool from Somnia MCP\n" +
      "2. Save wallet details by sending them to Telegram using the SEND_MESSAGE tool\n" +
      "3. Query blockchain data (accounts, transactions, blocks) using Somnia MCP tools\n" +
      "4. Search Somnia documentation using 'search_documentation'\n" +
      "5. Send messages and notifications to Telegram channels\n\n" +
      "IMPORTANT: When creating a wallet:\n" +
      "1. First use 'create_wallet' from Somnia MCP to generate the wallet\n" +
      "2. Then use 'save_wallet' to format the wallet details\n" +
      "3. Finally use 'SEND_MESSAGE' from Telegram MCP to send the formatted message to the user's Telegram chat/channel\n" +
      "4. Confirm to the user that the wallet details have been sent to Telegram\n\n" +
      "When asked to send wallet details to Telegram, ask the user for their chat ID or channel username (e.g., @mychannel or a numeric chat ID).\n\n" +
      "Always be helpful, clear, and security-conscious when handling wallet information. " +
      "Remind users to keep their mnemonic phrases safe and never share them publicly.",
  });

  return agent;
};

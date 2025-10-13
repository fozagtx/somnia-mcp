import { createTool } from "@iqai/adk";
import * as z from "zod";

/**
 * Tool to save wallet details by sending them to Telegram
 * This tool will be used in conjunction with the Telegram MCP SEND_MESSAGE tool
 * The actual sending will be orchestrated by the agent
 */
export const saveWalletTool = createTool({
  name: "save_wallet",
  description:
    "Prepare wallet details (address, mnemonic, network) for sending to Telegram. Returns formatted message that should be sent via Telegram.",
  schema: z.object({
    address: z.string().describe("Wallet address"),
    mnemonic: z.string().describe("Wallet mnemonic phrase"),
    network: z
      .enum(["MAINNET", "TESTNET"])
      .describe("Network the wallet is for"),
    label: z.string().optional().describe("Optional label/name for the wallet"),
  }),
  fn: async ({ address, mnemonic, network, label }) => {
    try {
      const timestamp = new Date().toISOString();
      const walletLabel = label || `Wallet ${timestamp}`;

      // Format wallet details as a message
      const message =
        `🔐 **New Wallet Created**\n\n` +
        `📛 **Label:** ${walletLabel}\n` +
        `🌐 **Network:** ${network}\n` +
        `📅 **Created:** ${timestamp}\n\n` +
        `💼 **Address:**\n\`${address}\`\n\n` +
        `🔑 **Mnemonic:**\n\`${mnemonic}\`\n\n` +
        `⚠️ **IMPORTANT:** Keep this mnemonic phrase safe and never share it with anyone!`;

      return {
        success: true,
        message: message,
        walletInfo: {
          address,
          network,
          label: walletLabel,
          createdAt: timestamp,
        },
        instruction:
          "Use the SEND_MESSAGE tool from Telegram MCP to send this message to your configured chat/channel",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to prepare wallet details: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

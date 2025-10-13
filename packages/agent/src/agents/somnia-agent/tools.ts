import { createTool } from "@iqai/adk";
import * as z from "zod";
import fs from "fs/promises";
import path from "path";
import { WALLET_DATA_DIR } from "./config";

/**
 * Tool to save wallet details to the filesystem
 */
export const saveWalletTool = createTool({
  name: "save_wallet",
  description:
    "Save wallet details (address, mnemonic, network) to the filesystem for future reference",
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
      // Ensure wallet directory exists
      await fs.mkdir(WALLET_DATA_DIR, { recursive: true });

      // Create wallet filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `wallet-${network.toLowerCase()}-${timestamp}.json`;
      const filepath = path.join(WALLET_DATA_DIR, filename);

      // Wallet data structure
      const walletData = {
        address,
        mnemonic,
        network,
        label: label || `Wallet ${timestamp}`,
        createdAt: new Date().toISOString(),
      };

      // Save wallet to file
      await fs.writeFile(filepath, JSON.stringify(walletData, null, 2));

      // Also maintain an index file
      const indexPath = path.join(WALLET_DATA_DIR, "wallets-index.json");
      let index: any[] = [];

      try {
        const indexContent = await fs.readFile(indexPath, "utf-8");
        index = JSON.parse(indexContent);
      } catch (error) {
        // Index doesn't exist yet, that's ok
      }

      index.push({
        address,
        network,
        label: walletData.label,
        createdAt: walletData.createdAt,
        filename,
      });

      await fs.writeFile(indexPath, JSON.stringify(index, null, 2));

      return {
        success: true,
        message: `Wallet saved successfully to ${filename}`,
        filepath,
        address,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to save wallet: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

/**
 * Tool to list all saved wallets
 */
export const listWalletsTool = createTool({
  name: "list_wallets",
  description: "List all saved wallets from the filesystem",
  schema: z.object({}),
  fn: async () => {
    try {
      const indexPath = path.join(WALLET_DATA_DIR, "wallets-index.json");

      try {
        const indexContent = await fs.readFile(indexPath, "utf-8");
        const wallets = JSON.parse(indexContent);

        return {
          success: true,
          wallets,
          count: wallets.length,
        };
      } catch (error) {
        return {
          success: true,
          wallets: [],
          count: 0,
          message: "No wallets found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to list wallets: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

/**
 * Tool to get a specific wallet by address
 */
export const getWalletTool = createTool({
  name: "get_wallet",
  description: "Retrieve a specific wallet by its address",
  schema: z.object({
    address: z.string().describe("Wallet address to retrieve"),
  }),
  fn: async ({ address }) => {
    try {
      const files = await fs.readdir(WALLET_DATA_DIR);
      const walletFiles = files.filter((f) => f.startsWith("wallet-"));

      for (const file of walletFiles) {
        const filepath = path.join(WALLET_DATA_DIR, file);
        const content = await fs.readFile(filepath, "utf-8");
        const wallet = JSON.parse(content);

        if (wallet.address.toLowerCase() === address.toLowerCase()) {
          return {
            success: true,
            wallet,
          };
        }
      }

      return {
        success: false,
        message: `Wallet with address ${address} not found`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve wallet: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

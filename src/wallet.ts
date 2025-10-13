import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createWalletClient, http, defineChain, type WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { somniaConfig } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Suppress dotenv logging (already loaded in index.ts, this is fallback)
const originalLog = console.log;
console.log = () => {};
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log = originalLog;

export const currentEnvironment = process.env.ENVIRONMENT || "";
export const isMainnet = currentEnvironment === "MAINNET";
export const agentSecretKey = process.env.AGENT_SECRET_KEY || "";
export const rpcUrl = isMainnet
  ? somniaConfig.mainnet.rpc
  : somniaConfig.testnet.rpc;

// Define Somnia chain
const somniaMainnet = defineChain({
  id: somniaConfig.mainnet.chainId,
  name: "Somnia Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "STT",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: [somniaConfig.mainnet.rpc],
    },
  },
  blockExplorers: {
    default: { name: "Somnia Explorer", url: "https://somniascan.io" },
  },
});

const somniaTestnet = defineChain({
  id: somniaConfig.testnet.chainId,
  name: "Somnia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "STT",
    symbol: "STT",
  },
  rpcUrls: {
    default: {
      http: [somniaConfig.testnet.rpc],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Testnet Explorer",
      url: "https://testnet.somniascan.io",
    },
  },
  testnet: true,
});

export const somniaChain = isMainnet ? somniaMainnet : somniaTestnet;

// Validate private key
if (!agentSecretKey) {
  throw new Error(
    "AGENT_SECRET_KEY is not set in environment variables. Please check your .env file.",
  );
}

if (!agentSecretKey.match(/^0x[0-9a-fA-F]{64}$/)) {
  throw new Error(
    `Invalid AGENT_SECRET_KEY format. Expected 0x followed by 64 hex characters, got: ${agentSecretKey.substring(0, 10)}...`,
  );
}

export const account = privateKeyToAccount(agentSecretKey as `0x${string}`);

export const walletClient: WalletClient = createWalletClient({
  account,
  transport: http(rpcUrl),
  chain: somniaChain,
});

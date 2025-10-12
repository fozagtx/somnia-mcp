import { http, createWalletClient, type WalletClient, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { somniaConfig } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

export const account = privateKeyToAccount(agentSecretKey as `0x${string}`);

export const walletClient: WalletClient = createWalletClient({
  account,
  transport: http(rpcUrl),
  chain: somniaChain,
});

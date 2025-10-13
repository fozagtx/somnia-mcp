const CONTROLLER_ABORT_TIMEOUT_MS = 15_000; // 15 seconds
const ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
const TXID_REGEX = /^0x[0-9a-fA-F]{64}$/;

const MCP_CLIENT_NAME = "somnia-docs-client";
const MCP_CLIENT_VERSION = "1.0.0";
const SOMNIA_DOCS_URL = "https://docs.somnia.network/";

const MCP_SERVER_NAME = "somnia-mcp-server";
const MCP_SERVER_VERSION = "1.0.0";

const MAINNET_RPC_URL = "https://api.infra.mainnet.somnia.network/";
const TESTNET_RPC_URL = "https://dream-rpc.somnia.network/";
const MAINNET_API_BASE_URL = "https://api.infra.mainnet.somnia.network";
const TESTNET_API_BASE_URL = "https://dream-rpc.somnia.network";
const MAINNET_CHAIN_ID = 5031;
const TESTNET_CHAIN_ID = 50312;

export const somniaConfig = {
  general: {
    addressRegex: ADDRESS_REGEX,
    txidRegex: TXID_REGEX,
  },
  mainnet: {
    apiBaseUrl: MAINNET_API_BASE_URL,
    controllerAbortTimeout: CONTROLLER_ABORT_TIMEOUT_MS,
    rpc: MAINNET_RPC_URL,
    chainId: MAINNET_CHAIN_ID,
  },
  testnet: {
    apiBaseUrl: TESTNET_API_BASE_URL,
    controllerAbortTimeout: CONTROLLER_ABORT_TIMEOUT_MS,
    rpc: TESTNET_RPC_URL,
    chainId: TESTNET_CHAIN_ID,
  },
  mcpClient: {
    name: MCP_CLIENT_NAME,
    version: MCP_CLIENT_VERSION,
    somniaDocsUrl: SOMNIA_DOCS_URL,
  },
  mcpServer: {
    name: MCP_SERVER_NAME,
    version: MCP_SERVER_VERSION,
  },
};

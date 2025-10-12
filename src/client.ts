import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { somniaConfig } from "./config.js";

async function createGitbookMcpClient(docsUrl: string) {
  try {
    let client: Client | undefined = undefined;

    client = new Client(
      {
        name: somniaConfig.mcpClient.name,
        version: somniaConfig.mcpClient.version,
      },
      {
        capabilities: {},
      },
    );

    const mcpServerUrl = new URL(`${docsUrl}/~gitbook/mcp`);

    const transport = new StreamableHTTPClientTransport(
      mcpServerUrl,
    ) as Transport;

    await client.connect(transport);

    return {
      client,
      async listTools() {
        const resp = await client.listTools();
        return resp.tools ?? [];
      },
    };
  } catch (error) {
    console.error("Error connecting to GitBookClient:", error);
    throw error;
  }
}

export async function createSomniaDocsMcpClient() {
  try {
    const somniaConfigDocsMcpClient = await createGitbookMcpClient(
      somniaConfig.mcpClient.somniaDocsUrl,
    );
    return somniaConfigDocsMcpClient;
  } catch (err) {
    console.error("Error creating Somnia Docs MCP Client:", err);
    throw err;
  }
}

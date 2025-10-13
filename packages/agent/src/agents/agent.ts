import { AgentBuilder } from "@iqai/adk";
import { env } from "../env";
import { getSearchAgent } from "./search-agent/agent";
import { getSomniaAgent } from "./somnia-agent/agent";

export const getRootAgent = async () => {
  const searchAgent = await getSearchAgent();
  const somniaAgent = await getSomniaAgent();

  return AgentBuilder.create("root_agent")
    .withDescription(
      "Root agent for web search, browser automation, blockchain operations, and wallet management",
    )
    .withInstruction(
      "Route requests to the appropriate agent:\n" +
        "- Search Agent: For API-based web search\n" +
        "- Somnia Agent: For blockchain queries, wallet creation/management, and Somnia-related tasks\n" +
        "- Handle general conversation and route to sub-agents as needed",
    )
    .withModel(env.LLM_MODEL)
    .withSubAgents([searchAgent, somniaAgent])
    .build();
};

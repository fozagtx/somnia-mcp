import { config } from "dotenv";
import { z } from "zod";
import path from "path";

// Load .env from the package root (packages/agent/.env)
// When built, this will be in dist/, so we go up one level to find .env
config({ path: path.resolve(__dirname, "../.env") });

/**
 * Environment variable schema definition for the simple agent.
 *
 * Defines and validates required environment variables including:
 * - ADK_DEBUG: Optional debug mode flag (defaults to false)
 * - GOOGLE_API_KEY: Required API key for Google/Gemini model access
 * - LLM_MODEL: Model to use (defaults to "gemini-2.5-flash")
 * - BRAVE_API_KEY: Required API key for Brave search
 * - TELEGRAM_BOT_TOKEN: Required token for Telegram bot
 * - ENVIRONMENT: Blockchain environment (MAINNET or TESTNET)
 * - AGENT_SECRET_KEY: Required private key for blockchain agent
 */
export const envSchema = z.object({
  ADK_DEBUG: z.coerce.boolean().default(false),
  GOOGLE_API_KEY: z.string(),
  LLM_MODEL: z.string().default("gemini-2.5-flash"),
  BRAVE_API_KEY: z.string(),
  TELEGRAM_BOT_TOKEN: z.string(),
  ENVIRONMENT: z.enum(["MAINNET", "TESTNET"]).default("TESTNET"),
  AGENT_SECRET_KEY: z.string(),
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);

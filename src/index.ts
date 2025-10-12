import dotenv from "dotenv";
import { start } from "./server.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Suppress dotenv logging to stdout for stdio mode compatibility
const originalLog = console.log;
console.log = () => {};
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log = originalLog;

start().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

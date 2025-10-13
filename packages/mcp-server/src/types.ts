import type z from "zod";

export enum REVISION {
  Best = "best",
  Justified = "justified",
  Finalized = "finalized",
}

export interface SomniaTool {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  callback: (
    args: any,
  ) => Promise<{ content: Array<{ type: string; text: string }> }>;
}

import { generateText, Output } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { ResumeAnalysisSchema } from "../schema.js";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY as string,
});

export const generateAnthropic = async (
  model: string,
  prompt: string,
): Promise<string> => {
  const { text } = await generateText({
    model: anthropic(model),
    output: Output.object({
      schema: ResumeAnalysisSchema,
    }),
    prompt,
  });

  return text;
};

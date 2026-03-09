import { generateText, Output } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { ResumeAnalysisSchema } from "../schema.js";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY as string,
});

export const generateDeepseek = async (
  model: string,
  prompt: string,
): Promise<string> => {
  const { text } = await generateText({
    model: deepseek(model),
    output: Output.object({
      schema: ResumeAnalysisSchema,
    }),
    prompt,
  });

  return text;
};

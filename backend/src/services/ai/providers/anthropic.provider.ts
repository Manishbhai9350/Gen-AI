import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY as string,
});

export const generateAnthropic = async (
  model: string,
  prompt: string
): Promise<string> => {
  const { text } = await generateText({
    model: anthropic(model),
    prompt,
  });

  return text;
};
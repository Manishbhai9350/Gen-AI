import { generateText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY as string,
});

export const generateDeepseek = async (
  model: string,
  prompt: string,
): Promise<string> => {
  const { text } = await generateText({
    model: deepseek(model),
    prompt,
  });

  return text;
};

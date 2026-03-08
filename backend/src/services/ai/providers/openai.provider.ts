import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const generateOpenAI = async (
  model: string,
  prompt: string,
): Promise<string> => {
  const { text } = await generateText({
    model: openai(model),
    prompt,
    temperature: 0.7,
  });

  return text;
};

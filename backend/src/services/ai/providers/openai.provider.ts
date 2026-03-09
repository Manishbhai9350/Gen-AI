import { generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ResumeAnalysisSchema } from "../schema.js";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const generateOpenAI = async (
  model: string,
  prompt: string,
): Promise<string> => {
  const { text } = await generateText({
    model: openai(model),
    output: Output.object({
      schema: ResumeAnalysisSchema,
    }),
    prompt,
    temperature: 0.7,
  });

  return text;
};

import { generateText, Output } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { ResumeAnalysisSchema } from "../schema.js";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY as string,
});

export const generateGroq = async (
  model: string,
  prompt: string,
): Promise<string> => {
  const { text } = await generateText({
    model: groq(model),
    output: Output.object({
      schema: ResumeAnalysisSchema,
    }),
    prompt,
  });

  return text;
};

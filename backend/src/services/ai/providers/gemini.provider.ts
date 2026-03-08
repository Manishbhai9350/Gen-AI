import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";


const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY as string,
});



export const generateGemini = async (
  model: string,
  prompt: string,
): Promise<string> => {
  const { text } = await generateText({
    model: google(model),
    prompt,
  });

  return text;
};

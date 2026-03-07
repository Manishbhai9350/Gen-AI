import { createOpenAI } from "@ai-sdk/openai";

const client = new createOpenAI({
  apiKey: process.env.OPENAI_CREDENTIAL_KEY as String,
});

export const generateOpenAI = async (model: string, prompt: string) => {
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
};

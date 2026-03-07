import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const generateGroq = async (model: string, prompt: string) => {
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
};
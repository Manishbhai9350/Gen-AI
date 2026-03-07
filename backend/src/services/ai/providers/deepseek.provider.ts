import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const generateDeepSeek = async (model: string, prompt: string) => {
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
};

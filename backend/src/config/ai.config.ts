export type AIProvider = "openai" | "groq" | "deepseek";

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
}

export const AI_MODELS: Record<string, AIModelConfig> = {
  "gpt-4o": {
    provider: "openai",
    model: "gpt-4o",
  },

  "gpt-4o-mini": {
    provider: "openai",
    model: "gpt-4o-mini",
  },

  "llama3-70b": {
    provider: "groq",
    model: "llama3-70b-8192",
  },

  "deepseek-chat": {
    provider: "deepseek",
    model: "deepseek-chat",
  },
};
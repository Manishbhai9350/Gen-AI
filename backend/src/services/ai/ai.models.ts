export type AIProvider =
  | "openai"
  | "anthropic"
  | "deepseek"
  | "groq"
  | "gemini";

export type CostTier = "cheap" | "medium" | "expensive";

export interface AIModelConfig {
  name: string;
  model: string;

  enabled: boolean; // company preference
  tokenLimit: number; // allowed tokens
  costTier: CostTier;

  fallback?: string; // optional fallback model
}

export interface AIProviderConfig {
  provider: AIProvider;
  models: AIModelConfig[];
}
export const AI_MODELS: Record<AIProvider, AIProviderConfig> = {
  openai: {
    provider: "openai",
    models: [
      {
        name: "o4-mini",
        model: "openai/o4-mini",
        enabled: true,
        tokenLimit: 200000,
        costTier: "medium",
        fallback: "gpt-oss-20b",
      },
      {
        name: "gpt-oss-20b",
        model: "openai/gpt-oss-20b",
        enabled: true,
        tokenLimit: 131000,
        costTier: "cheap",
      },
      {
        name: "gpt-5-chat",
        model: "openai/gpt-5-chat",
        enabled: false,
        tokenLimit: 128000,
        costTier: "expensive",
      },
      {
        name: "gpt-5.3-chat",
        model: "openai/gpt-5.3-chat",
        enabled: false,
        tokenLimit: 128000,
        costTier: "expensive",
      },
      {
        name: "o3",
        model: "openai/o3",
        enabled: false,
        tokenLimit: 200000,
        costTier: "medium",
      },
    ],
  },

  gemini: {
    provider: "gemini",
    models: [
      {
        name: "gemini-2.5-flash",
        model: "google/gemini-2.5-flash",
        enabled: true,
        tokenLimit: 1000000,
        costTier: "medium",
        fallback: "gemini-2.5-flash-lite",
      },
      {
        name: "gemini-2.5-flash-lite",
        model: "google/gemini-2.5-flash-lite",
        enabled: true,
        tokenLimit: 1000000,
        costTier: "cheap",
      },
      {
        name: "gemini-3-flash",
        model: "google/gemini-3-flash",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "medium",
      },
      {
        name: "gemini-2.5-pro",
        model: "google/gemini-2.5-pro",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "expensive",
      },
      {
        name: "gemini-3.1-pro-preview",
        model: "google/gemini-3.1-pro-preview",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "expensive",
      },
    ],
  },

  deepseek: {
    provider: "deepseek",
    models: [
      {
        name: "deepseek-v3.2",
        model: "deepseek/deepseek-v3.2",
        enabled: true,
        tokenLimit: 164000,
        costTier: "cheap",
        fallback: "deepseek-v3.1",
      },
      {
        name: "deepseek-v3.1",
        model: "deepseek/deepseek-v3.1",
        enabled: true,
        tokenLimit: 164000,
        costTier: "cheap",
      },
      {
        name: "deepseek-v3",
        model: "deepseek/deepseek-v3",
        enabled: false,
        tokenLimit: 164000,
        costTier: "medium",
      },
      {
        name: "deepseek-v3.2-thinking",
        model: "deepseek/deepseek-v3.2-thinking",
        enabled: false,
        tokenLimit: 128000,
        costTier: "medium",
      },
      {
        name: "deepseek-r1",
        model: "deepseek/deepseek-r1",
        enabled: false,
        tokenLimit: 164000,
        costTier: "expensive",
      },
    ],
  },

  groq: {
    provider: "groq",
    models: [
      {
        name: "grok-4-fast-reasoning",
        model: "xai/grok-4-fast-reasoning",
        enabled: true,
        tokenLimit: 2000000,
        costTier: "medium",
        fallback: "grok-4-fast-non-reasoning",
      },
      {
        name: "grok-4-fast-non-reasoning",
        model: "xai/grok-4-fast-non-reasoning",
        enabled: true,
        tokenLimit: 2000000,
        costTier: "cheap",
      },
      {
        name: "grok-code-fast-1",
        model: "xai/grok-code-fast-1",
        enabled: false,
        tokenLimit: 256000,
        costTier: "medium",
      },
      {
        name: "grok-3-mini",
        model: "xai/grok-3-mini",
        enabled: false,
        tokenLimit: 131000,
        costTier: "cheap",
      },
      {
        name: "grok-4",
        model: "xai/grok-4",
        enabled: false,
        tokenLimit: 256000,
        costTier: "expensive",
      },
    ],
  },

  anthropic: {
    provider: "anthropic",
    models: [
      {
        name: "claude-haiku-4.5",
        model: "anthropic/claude-haiku-4.5",
        enabled: true,
        tokenLimit: 200000,
        costTier: "cheap",
        fallback: "claude-3.5-haiku",
      },
      {
        name: "claude-3.5-haiku",
        model: "anthropic/claude-3.5-haiku",
        enabled: true,
        tokenLimit: 200000,
        costTier: "cheap",
      },
      {
        name: "claude-sonnet-4.6",
        model: "anthropic/claude-sonnet-4.6",
        enabled: true,
        tokenLimit: 1000000,
        costTier: "medium",
        fallback: "claude-sonnet-4.5",
      },
      {
        name: "claude-sonnet-4.5",
        model: "anthropic/claude-sonnet-4.5",
        enabled: true,
        tokenLimit: 1000000,
        costTier: "medium",
      },
      {
        name: "claude-sonnet-4",
        model: "anthropic/claude-sonnet-4",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "medium",
      },
      {
        name: "claude-3.7-sonnet",
        model: "anthropic/claude-3.7-sonnet",
        enabled: false,
        tokenLimit: 200000,
        costTier: "medium",
      },
      {
        name: "claude-opus-4.6",
        model: "anthropic/claude-opus-4.6",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "expensive",
      },
      {
        name: "claude-opus-4.5",
        model: "anthropic/claude-opus-4.5",
        enabled: false,
        tokenLimit: 200000,
        costTier: "expensive",
      },
      {
        name: "claude-opus-4",
        model: "anthropic/claude-opus-4",
        enabled: false,
        tokenLimit: 200000,
        costTier: "expensive",
      },
    ],
  },

  // xai: {
  //   provider: "xai",
  //   models: [
  //     {
  //       name: "grok-4-fast",
  //       model: "xai/grok-4-fast-non-reasoning",
  //       enabled: true,
  //       tokenLimit: 2000000,
  //       costTier: "cheap",
  //     },
  //     {
  //       name: "grok-4-reasoning",
  //       model: "xai/grok-4-fast-reasoning",
  //       enabled: true,
  //       tokenLimit: 2000000,
  //       costTier: "medium",
  //     },
  //   ],
  // },

  // mistral: {
  //   provider: "mistral",
  //   models: [
  //     {
  //       name: "devstral-2",
  //       model: "mistral/devstral-2",
  //       enabled: true,
  //       tokenLimit: 256000,
  //       costTier: "medium",
  //     },
  //   ],
  // },
};

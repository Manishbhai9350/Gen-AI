export type AIProvider =
  | "openai"
  | "anthropic"
  | "deepseek"
  | "groq"
  | "gemini";

export type CostTier = "cheap" | "medium" | "expensive";

export interface AIModelConfig {
  model: string;
  name: string;

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
        model: "o4-mini",
        name: "openai/o4-mini",
        enabled: true,
        tokenLimit: 200000,
        costTier: "medium",
        fallback: "gpt-oss-20b",
      },
      {
        model: "gpt-oss-20b",
        name: "openai/gpt-oss-20b",
        enabled: true,
        tokenLimit: 131000,
        costTier: "cheap",
      },
      {
        model: "gpt-5-chat",
        name: "openai/gpt-5-chat",
        enabled: false,
        tokenLimit: 128000,
        costTier: "expensive",
      },
      {
        model: "gpt-5.3-chat",
        name: "openai/gpt-5.3-chat",
        enabled: false,
        tokenLimit: 128000,
        costTier: "expensive",
      },
      {
        model: "o3",
        name: "openai/o3",
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
        model: "gemini-2.5-flash",
        name: "google/gemini-2.5-flash",
        enabled: true,
        tokenLimit: 1000000,
        costTier: "medium",
        fallback: "gemini-2.5-flash-lite",
      },
      {
        model: "gemini-2.5-flash-lite",
        name: "google/gemini-2.5-flash-lite",
        enabled: true,
        tokenLimit: 1000000,
        costTier: "cheap",
      },
      {
        model: "gemini-3-flash",
        name: "google/gemini-3-flash",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "medium",
      },
      {
        model: "gemini-2.5-pro",
        name: "google/gemini-2.5-pro",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "expensive",
      },
      {
        model: "gemini-3.1-pro-preview",
        name: "google/gemini-3.1-pro-preview",
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
        model: "deepseek-v3.2",
        name: "deepseek/deepseek-v3.2",
        enabled: true,
        tokenLimit: 164000,
        costTier: "cheap",
        fallback: "deepseek-v3.1",
      },
      {
        model: "deepseek-v3.1",
        name: "deepseek/deepseek-v3.1",
        enabled: true,
        tokenLimit: 164000,
        costTier: "cheap",
      },
      {
        model: "deepseek-v3",
        name: "deepseek/deepseek-v3",
        enabled: false,
        tokenLimit: 164000,
        costTier: "medium",
      },
      {
        model: "deepseek-v3.2-thinking",
        name: "deepseek/deepseek-v3.2-thinking",
        enabled: false,
        tokenLimit: 128000,
        costTier: "medium",
      },
      {
        model: "deepseek-r1",
        name: "deepseek/deepseek-r1",
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
        model: "grok-4-fast-reasoning",
        name: "xai/grok-4-fast-reasoning",
        enabled: true,
        tokenLimit: 2000000,
        costTier: "medium",
        fallback: "grok-4-fast-non-reasoning",
      },
      {
        model: "grok-4-fast-non-reasoning",
        name: "xai/grok-4-fast-non-reasoning",
        enabled: true,
        tokenLimit: 2000000,
        costTier: "cheap",
      },
      {
        model: "grok-code-fast-1",
        name: "xai/grok-code-fast-1",
        enabled: false,
        tokenLimit: 256000,
        costTier: "medium",
      },
      {
        model: "grok-3-mini",
        name: "xai/grok-3-mini",
        enabled: false,
        tokenLimit: 131000,
        costTier: "cheap",
      },
      {
        model: "grok-4",
        name: "xai/grok-4",
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
        model: "claude-haiku-4.5",
        name: "anthropic/claude-haiku-4.5",
        enabled: true,
        tokenLimit: 200000,
        costTier: "cheap",
        fallback: "claude-3.5-haiku",
      },
      {
        model: "claude-3.5-haiku",
        name: "anthropic/claude-3.5-haiku",
        enabled: true,
        tokenLimit: 200000,
        costTier: "cheap",
      },
      {
        model: "claude-sonnet-4.6",
        name: "anthropic/claude-sonnet-4.6",
        enabled: true,
        tokenLimit: 1000000,
        costTier: "medium",
        fallback: "claude-sonnet-4.5",
      },
      {
        model: "claude-sonnet-4.5",
        name: "anthropic/claude-sonnet-4.5",
        enabled: true,
        tokenLimit: 1000000,
        costTier: "medium",
      },
      {
        model: "claude-sonnet-4",
        name: "anthropic/claude-sonnet-4",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "medium",
      },
      {
        model: "claude-3.7-sonnet",
        name: "anthropic/claude-3.7-sonnet",
        enabled: false,
        tokenLimit: 200000,
        costTier: "medium",
      },
      {
        model: "claude-opus-4.6",
        name: "anthropic/claude-opus-4.6",
        enabled: false,
        tokenLimit: 1000000,
        costTier: "expensive",
      },
      {
        model: "claude-opus-4.5",
        name: "anthropic/claude-opus-4.5",
        enabled: false,
        tokenLimit: 200000,
        costTier: "expensive",
      },
      {
        model: "claude-opus-4",
        name: "anthropic/claude-opus-4",
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
  //       model: "grok-4-fast",
  //       name: "xai/grok-4-fast-non-reasoning",
  //       enabled: true,
  //       tokenLimit: 2000000,
  //       costTier: "cheap",
  //     },
  //     {
  //       model: "grok-4-reasoning",
  //       name: "xai/grok-4-fast-reasoning",
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
  //       model: "devstral-2",
  //       name: "mistral/devstral-2",
  //       enabled: true,
  //       tokenLimit: 256000,
  //       costTier: "medium",
  //     },
  //   ],
  // },
};

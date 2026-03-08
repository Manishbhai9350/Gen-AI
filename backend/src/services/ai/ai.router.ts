import { generateAnthropic } from "./providers/anthropic.provider.js";
import { generateDeepseek } from "./providers/deepseek.provider.js";
import { generateGemini } from "./providers/gemini.provider.js";
import { generateGroq } from "./providers/groq.provider.js";
import { generateOpenAI } from "./providers/openai.provider.js";

export const runAI = async (
  provider: string,
  model: string,
  prompt: string,
) => {
  switch (provider) {
    case "openai":
      return generateOpenAI(model, prompt);

    case "groq":
      return generateGroq(model, prompt);

    case "deepseek":
      return generateDeepseek(model, prompt);

    case "gemini":
      return generateGemini(model, prompt);

    case "anthropic":
      return generateAnthropic(model, prompt);

    default:
      throw new Error("Unsupported AI provider");
  }
};

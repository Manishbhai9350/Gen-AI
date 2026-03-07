import { generateDeepSeek } from "./providers/deepseek.provider.js";
import { generateGroq } from "./providers/groq.provider.js";
import { generateOpenAI } from "./providers/openai.provider.js";


export const runAI = async (
  provider: string,
  model: string,
  prompt: string
) => {
  switch (provider) {
    case "openai":
      return generateOpenAI(model, prompt);

    case "groq":
      return generateGroq(model, prompt);

    case "deepseek":
      return generateDeepSeek(model, prompt);

    default:
      throw new Error("Unsupported AI provider");
  }
};
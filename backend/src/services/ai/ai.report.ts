import { InterviewReportModel } from "../../models/interview/interview.report.model.js";
import { buildInterviewPrompt } from "../../utils/ai.prompt.js";
import { AI_MODELS, type AIProvider } from "./ai.models.js";
import { runAI } from "./ai.router.js";

interface AiReportInput {
  resume: string;
  jobDescription: string;
  userDescription: string;
  ai_provider: AIProvider;
  ai_model: string;
}

export const AiReport = async ({
  resume,
  jobDescription,
  userDescription,
  ai_provider,
  ai_model,
}: AiReportInput) => {
  const config = AI_MODELS[ai_provider];

  if (!config) throw new Error("Invalid AI Provider");

  const prompt = buildInterviewPrompt(resume, jobDescription, userDescription);

  const model = config.models.find((m) => m.model == ai_model);

  if (!model || !model.enabled) throw new Error("Invalid AI model");

  const aiResponse = await runAI(config.provider, model.model, prompt);

  let reportData;

  try {
    reportData = JSON.parse(aiResponse as string);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  

  return reportData;
};

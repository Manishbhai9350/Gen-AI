import { AI_MODELS } from "../../config/ai.config";
import { buildInterviewPrompt } from "../../utils/prompts/interview.prompt";
import { runAI } from "./ai-router";
import { InterviewReportModel } from "../../models/interview/interview.model";

interface AiReportInput {
  resume: string;
  jobDescription: string;
  userDescription: string;
  modelKey: string;
}

export const AiReport = async ({
  resume,
  jobDescription,
  userDescription,
  modelKey,
}: AiReportInput) => {
  const config = AI_MODELS[modelKey];

  if (!config) throw new Error("Invalid AI model");

  const prompt = buildInterviewPrompt(resume, jobDescription, userDescription);

  const aiResponse = await runAI(config.provider, config.model, prompt);

  let reportData;

  try {
    reportData = JSON.parse(aiResponse as string);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const report = await InterviewReportModel.create({
    resume,
    jobDescription,
    userDescription,
    ...reportData,
    ai: {
      provider: config.provider,
      model: config.model,
    },
  });

  return report;
};

import type { Request, Response, NextFunction } from "express";
import { AiReport } from "../../services/ai/ai.report.js";
import { GetPDFText } from "../../utils/pdf.parse.js";
import { InterviewReportModel } from "../../models/interview/interview.report.model.js";

export const InterviewReportController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { jobDescription, userDescription, ai_model, ai_provider } =
      req.body;

    const { user } = req as Request & { user?: { _id: string } };


    if (!user) {``
      throw new Error("Unauthenticated");
    }

    if (!req.file) {
      throw new Error("Missing Resume");
    }

    const pdfFile = req.file;

    if (!pdfFile || !jobDescription || !userDescription) {
      throw new Error("Missing Data");
    }

    const ResumeText = await GetPDFText(pdfFile.buffer);

    const provider = ai_provider || "gemini";
    const model = ai_model || "gemini-2.5-flash";

    const AiReportData = await AiReport({
      resume: ResumeText,
      jobDescription,
      userDescription,
      ai_provider: provider,
      ai_model: model,
    });

    const report = await InterviewReportModel.create({
      user: user._id,
      resume:ResumeText,
      jobDescription,
      userDescription,
      ...AiReportData,
      ai: {
        provider,
        model,
      },
    });

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

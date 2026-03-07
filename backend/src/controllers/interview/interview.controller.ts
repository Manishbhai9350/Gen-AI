import type { Request, Response, NextFunction } from "express";
import { AiReport } from "../../services/ai/ai.report.js";

export const GenerateReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { resume, jobDescription, userDescription, model } = req.body;

    const report = await AiReport({
      resume,
      jobDescription,
      userDescription,
      modelKey: model || "gpt-4o",
    });

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

import type { Request, Response, NextFunction } from "express";
import { AiReport } from "../../services/ai/ai.report.js";
import { GetPDFText } from "../../utils/pdf.parse.js";
import { InterviewReportModel } from "../../models/interview/interview.report.model.js";



// ── GET /interview/report ────────────────────────────────────────────────────
// Generates Report by Given Jobscription, userDescription and Resume
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

// ── GET /interview/:id ────────────────────────────────────────────────────
// Fetches a single interview report by id.
// Ensures the report belongs to the requesting user.
export const GetInterviewReportController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // req.user is set by your auth middleware
    const userId = (req as any).user?._id;
 
    const report = await InterviewReportModel.findById(id).lean();
 
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
 
    if (report.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
 
    return res.status(200).json({ report });
  } catch (err) {
    console.error("[getInterviewReport]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 
// ── GET /interview ───────────────────────────────────────────────────────
// Returns all reports for the logged-in user (dashboard list).
export const GetUserReportsController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
 
    const reports = await InterviewReportModel.find({ user: userId })
      .select("overallScore sectionScores jobDescription strengths improvements createdAt preparationPlan.totalDays")
      .sort({ createdAt: -1 })
      .lean();
 
    return res.status(200).json({ reports });
  } catch (err) {
    console.error("[getUserReports]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 
// ── PATCH /interview/:id/tasks ──────────────────────────────────────────
// Toggles a single task's completed state.
// Body: { dayIndex: number, taskId: string }
// After toggling, recalculates completedCount, isCompleted, and
// unlocks the next day if the current day just became fully complete.
export const ToggleTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { dayIndex, taskId } = req.body as {
      dayIndex: number;
      taskId: string;
    };
    const userId = (req as any).user?._id;
 
    if (dayIndex === undefined || !taskId) {
      return res.status(400).json({ message: "dayIndex and taskId are required" });
    }
 
    // 1. Load the full document (need _id paths for $ operator)
    const report = await InterviewReportModel.findById(id);
 
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    if (report.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
 
    const day = report.preparationPlan?.plan?.[dayIndex];
    if (!day) {
      return res.status(400).json({ message: "Day not found" });
    }
 
    // 2. Guard: day must be unlocked
    if (!day.isUnlocked) {
      return res.status(400).json({ message: "Day is locked" });
    }
 
    // 3. Find & toggle the task
    const task = day.tasks.find((t: any) => t._id.toString() === taskId);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }
    task.completed = !task.completed;
 
    // 4. Recalculate completedCount + isCompleted for this day
    const completedCount = day.tasks.filter((t: any) => t.completed).length;
    const totalCount = day.tasks.length;
    day.completedCount = completedCount;
    day.totalCount = totalCount;
    day.isCompleted = completedCount === totalCount && totalCount > 0;
 
    // 5. If day is now completed → unlock the next day
    if (day.isCompleted) {
      const nextDay = report.preparationPlan?.plan?.[dayIndex + 1];
      if (nextDay) nextDay.isUnlocked = true;
    } else {
      // If day reverted from complete → re-lock next day (and cascade lock)
      cascadeLock(report.preparationPlan?.plan ?? [], dayIndex + 1);
    }
 
    await report.save();
 
    // Return the updated preparationPlan only (lighter payload)
    return res.status(200).json({
      preparationPlan: report.preparationPlan,
    });
  } catch (err) {
    console.error("[toggleTask]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 
// ── Helper: lock a day and all subsequent days ────────────────────────────────
function cascadeLock(plan: any[], fromIndex: number) {
  for (let i = fromIndex; i < plan.length; i++) {
    plan[i].isUnlocked = false;
    // also un-complete tasks in locked days
    plan[i].tasks.forEach((t: any) => {
      t.completed = false;
    });
    plan[i].completedCount = 0;
    plan[i].isCompleted = false;
  }
}
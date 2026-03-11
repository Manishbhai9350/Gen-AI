import type { NextFunction, Request, Response } from "express";
import { InterviewReportModel } from "../../models/interview/interview.report.model.js";
import type { ObjectId } from "mongoose";

export const GetDashboardDataController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req as Request & {
      user: { _id: ObjectId; username: string; email: string; password: string };
    };

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = user._id;

    /* ---------------- TOTAL ANALYSIS ---------------- */

    const totalAnalysis = await InterviewReportModel.countDocuments({
      user:userId
    });

    /* ---------------- THIS WEEK ANALYSIS ---------------- */

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const analysisThisWeek = await InterviewReportModel.countDocuments({
      user:userId,
      createdAt: { $gte: startOfWeek },
    });

    /* ---------------- AVERAGE SCORE ---------------- */

    const avgScoreResult = await InterviewReportModel.aggregate([
      { $match: { user:userId } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$overallScore" },
        },
      },
    ]);

    const averageScore =
      avgScoreResult.length > 0 ? avgScoreResult[0].averageScore : 0;

    /* ---------------- TOP MATCH ---------------- */

    const topMatch = await InterviewReportModel.findOne({ user:userId })
      .sort({ overallScore: -1 })
      .limit(1);

    /* ---------------- RECENT ANALYSIS ---------------- */

    const recentAnalysis = await InterviewReportModel.find({ user:userId })
      .sort({ createdAt: -1 })
      .limit(5);

    /* ---------------- RESPONSE ---------------- */

    res.status(200).json({
      success: true,
      report: {
        totalAnalysis,
        analysisThisWeek,
        averageScore: Math.round(averageScore || 0),
        topMatch,
        recentAnalysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

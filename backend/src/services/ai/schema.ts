import { z } from "zod";

const QuestionSchema = z.object({
  question: z.string(),
  expectedAnswer: z.string().optional(),
  userAnswer: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  score: z.number().min(0).max(10).optional(),
  feedback: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const SkillGapSchema = z.object({
  skill: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  explanation: z.string().optional(),
  resources: z.array(z.string()).optional(),
});

const DailyTaskSchema = z.object({
  task: z.string(),
  completed: z.boolean().default(false),
});

const PreparationDaySchema = z.object({
  day: z.number(),
  focus: z.string(),
  tasks: z.array(DailyTaskSchema),
  // Derived fields — controller keeps these in sync, AI sets initial values
  completedCount: z.number().default(0),
  totalCount: z.number().default(0),
  isCompleted: z.boolean().default(false),
  isUnlocked: z.boolean().default(false),
});

const PreparationPlanSchema = z.object({
  totalDays: z.number(),
  plan: z.array(PreparationDaySchema),
});

export const ResumeAnalysisSchema = z.object({
  technicalQuestions: z.array(QuestionSchema),
  behavioralQuestions: z.array(QuestionSchema),
  skillGaps: z.array(SkillGapSchema),
  preparationPlan: PreparationPlanSchema, // ← was z.array(), now single object
  sectionScores: z.object({
    technical: z.number(),
    behavioral: z.number(),
    communication: z.number(),
  }),
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});
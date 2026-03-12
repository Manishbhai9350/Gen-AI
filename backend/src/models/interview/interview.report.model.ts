import mongoose, { Model, Schema, model } from "mongoose";

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const QuestionSchema = new Schema<Question>(
  {
    question: { type: String, required: true },
    expectedAnswer: String,
    userAnswer: String,
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },
    score: { type: Number, min: 0, max: 10 },
    feedback: String,
    tags: [String],
  },
  { _id: false },
);

const SkillGapSchema = new Schema<SkillGap>(
  {
    skill: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    explanation: String,
    resources: [String],
  },
  { _id: false },
);

// ── Updated: DailyTask now has an _id so we can target individual tasks ───────
const DailyTaskSchema = new Schema<DailyTask>({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
// _id is intentionally ON here (default true) so each task has a unique id

// ── Updated: PreparationDay tracks per-day completion state ──────────────────
const PreparationDaySchema = new Schema<PreparationDay>(
  {
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [DailyTaskSchema],
    // NEW ─ derived convenience fields, kept in sync by the controller
    completedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    // NEW ─ unlocked = previous day completed (day 1 is always unlocked)
    isUnlocked: { type: Boolean, default: false },
  },
);

const PreparationPlanSchema = new Schema<PreparationPlan>(
  {
    totalDays: { type: Number, required: true },
    plan: [PreparationDaySchema],
  },
  { _id: false },
);

const AISchema = new Schema<AIInfo>({
  provider: String,
  model: String,
  temperature: Number,
  tokensUsed: Number,
  estimatedCost: Number,
});

// ── Main report schema ────────────────────────────────────────────────────────
const InterviewReportSchema = new Schema<InterviewReport>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: String,
    jobDescription: String,
    userDescription: String,
    technicalQuestions: [QuestionSchema],
    behavioralQuestions: [QuestionSchema],
    skillGaps: [SkillGapSchema],
    preparationPlan: PreparationPlanSchema,
    sectionScores: {
      technical: Number,
      behavioral: Number,
      communication: Number,
    },
    overallScore: { type: Number, min: 0, max: 100 },
    strengths: [String],
    improvements: [String],
    ai: AISchema,
  },
  { timestamps: true },
);

InterviewReportSchema.index({ user: 1, createdAt: -1 });

export const InterviewReportModel =
  (mongoose.models.InterviewReport as Model<InterviewReport>) ||
  model<InterviewReport>("InterviewReport", InterviewReportSchema);
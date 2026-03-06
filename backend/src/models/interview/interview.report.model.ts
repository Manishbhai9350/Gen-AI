import mongoose, { Schema, model } from "mongoose";

const QuestionSchema = new Schema<Question>({
  question: { type: String, required: true },
  expectedAnswer: String,
  userAnswer: String,
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
  },
  feedback: String,
  tags: [String],
});

const SkillGapSchema = new Schema<SkillGap>({
  skill: { type: String, required: true },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  explanation: String,
  resources: [String],
});

const DailyTaskSchema = new Schema<DailyTask>({
  task: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const PreparationDaySchema = new Schema<PreparationDay>({
  day: Number,
  focus: String,
  tasks: [DailyTaskSchema],
});

const PreparationPlanSchema = new Schema<PreparationPlan>({
  totalDays: Number,
  plan: [PreparationDaySchema],
});

const AISchema = new Schema<AIInfo>({
  provider: String,
  model: String,
  temperature: Number,
  tokensUsed: Number,
  estimatedCost: Number,
});

const InterviewReportSchema = new Schema<InterviewReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    resume: String,
    jobDescription: String,
    userDescription: String,

    technicalQuestions: [QuestionSchema],
    behavioralQuestions: [QuestionSchema],

    skillGaps: [SkillGapSchema],

    preparationPlan: [PreparationPlanSchema],

    sectionScores: {
      technical: Number,
      behavioral: Number,
      communication: Number,
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    strengths: [String],
    improvements: [String],

    ai: AISchema,
  },
  {
    timestamps: true,
  },
);

export const InterviewReportModel =
  mongoose.models.InterviewReport ||
  model<InterviewReport>("InterviewReport", InterviewReportSchema);

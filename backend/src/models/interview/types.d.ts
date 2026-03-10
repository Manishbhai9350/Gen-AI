import { Types } from "mongoose";

declare global {
  type Severity = "low" | "medium" | "high";
  type Difficulty = "easy" | "medium" | "hard";

  interface Question {
    question: string;
    expectedAnswer?: string;
    userAnswer?: string;
    difficulty?: Difficulty;
    score?: number;
    feedback?: string;
    tags?: string[];
  }

  interface SkillGap {
    skill: string;
    severity: Severity;
    explanation?: string;
    resources?: string[];
  }

  interface DailyTask {
    task: string;
    completed?: boolean;
  }

  interface PreparationDay {
    day: number;
    focus: string;
    tasks: DailyTask[];
  }

  interface PreparationPlan {
    totalDays?: number;
    plan: PreparationDay[];
  }

  interface AIInfo {
    provider: string;
    model: string;
    temperature?: number;
    tokensUsed?: number;
    estimatedCost?: number;
  }

  interface SectionScores {
    technical?: number;
    behavioral?: number;
    communication?: number;
  }

  interface InterviewReport {
    user: Types.ObjectId;

    resume: string;
    jobDescription: string;
    userDescription: string;

    technicalQuestions: Question[];
    behavioralQuestions: Question[];

    skillGaps: SkillGap[];

    preparationPlan?: PreparationPlan[];

    sectionScores?: SectionScores;

    overallScore?: number;

    strengths?: string[];
    improvements?: string[];

    ai?: AIInfo;

    createdAt?: Date;
    updatedAt?: Date;
  }
}

export {};

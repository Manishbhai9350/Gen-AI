export type TechnicalQuestion = {
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  feedback: string;
  tags: string[];
};

export type BehavioralQuestion = {
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  feedback: string;
  tags: string[];
};

export type SkillGap = {
  skill: string;
  severity: "low" | "medium" | "high";
  explanation: string;
  resources: string[];
};

export type PreparationTask = {
  task: string;
  completed: boolean;
};

export type PreparationDay = {
  day: number;
  focus: string;
  tasks: PreparationTask[];
};

export type PreparationPlan = {
  totalDays: number;
  plan: PreparationDay[];
};

export type SectionScores = {
  technical: number;
  behavioral: number;
  communication: number;
};

export type AIInfo = {
  provider: string;
  model: string;
};

export type InterviewReport = {
  _id: string;
  resume: string;
  jobDescription: string;
  userDescription: string;

  technicalQuestions: TechnicalQuestion[];
  behavioralQuestions: BehavioralQuestion[];

  skillGaps: SkillGap[];
  preparationPlan: PreparationPlan[];

  sectionScores: SectionScores;

  overallScore: number;
  strengths: string[];
  improvements: string[];

  ai: AIInfo;

  createdAt: string;
  updatedAt: string;
};

export type InterviewReportResponse = {
  success: boolean;
  resumeText: string;
  report: InterviewReport;
};

export type Analysis = {
  id: string;
  role: string;
  company: string;
  score: number;
  date: string;
  tags: string[];
  status: "high" | "medium" | "low";
};
import { configDotenv } from "dotenv";
import express, { urlencoded } from "express";
import { Connect } from "./config/db.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import CookieParser from "cookie-parser";
import { AuthRouter } from "./routes/auth.route.js";
import cors from "cors";
import pinoHttp from "pino-http";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

configDotenv();

const app = express();

Connect();

const PORT = process.env.PORT || 3000;

app.use(pinoHttp());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
app.use(CookieParser());
app.use(urlencoded({ extended: true }));
app.use(errorHandler);

app.use("/auth", AuthRouter);

app.get("/", (req, res) => {
  return res.status(201).json({
    message: "Hallo From GEN AI:<manish>",
    success: true,
  });
});

// Testing AI
const GenPropmpt = ({ resume, jobDescription, userDescription }:{    }) => {
  return `
You are an AI interview coach.

Using the following information generate an interview analysis.

Resume:
${resume}

Job Description:
${jobDescription}

Candidate Description:
${userDescription}

Return ONLY valid JSON with this structure:

{
  "technicalQuestions": [
    {
      "question": "",
      "expectedAnswer": "",
      "difficulty": "easy | medium | hard",
      "tags": []
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "expectedAnswer": "",
      "difficulty": "easy | medium | hard"
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low | medium | high",
      "explanation": ""
    }
  ],
  "preparationPlan": {
    "totalDays": 7,
    "plan": [
      {
        "day": 1,
        "focus": "",
        "tasks": [
          { "task": "" }
        ]
      }
    ]
  },
  "sectionScores": {
    "technical": 0,
    "behavioral": 0,
    "communication": 0
  },
  "overallScore": 0,
  "strengths": [],
  "improvements": []
}
`;
};

const data = {
  resume: "Manish is a frontend developer skilled in React, Next.js...",
  jobDescription:
    "Looking for a frontend engineer experienced in React and performance optimization",
  userDescription: "I have 2 years experience building web apps",
};

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_CREDENTIAL_KEY!,
});
const testAI = async () => {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: GenPropmpt({
      ...data,
    }),
  });
  const reportData = JSON.parse(text);
  console.log(reportData);
};

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
  testAI();
});

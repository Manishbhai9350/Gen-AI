import { configDotenv } from "dotenv";
import express, { urlencoded } from "express";
import { Connect } from "./config/db.config.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import CookieParser from "cookie-parser";
import { AuthRouter } from "./routes/auth/auth.route.js";
import cors from "cors";
import pinoHttp from "pino-http";
import { InterviewRouter } from "./routes/interview/interview.route.js";
import { createGateway } from "@ai-sdk/gateway";
import { AI_MODELS } from "./services/ai/ai.models.js";
import { UserDataRouter } from "./routes/data/user.data.route.js";

configDotenv();

const app = express();

Connect();

const PORT = process.env.PORT || 3000;

// app.use(pinoHttp());
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
app.use("/interview", InterviewRouter);
app.use('/data', UserDataRouter)

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
});

app.get("/", async (req, res) => {
  const models = await gateway.getAvailableModels();
  return res.status(201).json({
    message: "Hallo From GEN AI:<manish>",
    models,
    success: true,
  });
});

app.listen(PORT, async () => {
  try {
    console.log(`App is running on http://localhost:${PORT}`);
    console.log(process.env.AI_GATEWAY_API_KEY);
    console.log(Object.keys(AI_MODELS));
    // ... inside an async function or API route
    // const availableModels = await gateway.getAvailableModels();

    // Iterate and log or process the list of models
    // console.log(availableModels.models)
  } catch (error) {
    console.log(error);
  }
});

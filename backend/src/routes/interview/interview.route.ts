import { Router } from "express";
import {
  GetInterviewReportController,
  InterviewReportController,
  ToggleTaskController,
  GenerateResumePdfController
} from "../../controllers/interview/interview.controller.js";
import { MulterUpload } from "../../config/multer.config.js";

const router = Router();

router.post(
  "/report",
  MulterUpload.single("resume"),
  InterviewReportController,
);

router.get("/:id", GetInterviewReportController);
router.get("/:id/tasks", ToggleTaskController);
router.patch("/:id/tasks", ToggleTaskController);
router.post("/generate/resume/:id", GenerateResumePdfController);

export { router as InterviewRouter };

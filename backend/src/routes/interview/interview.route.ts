import { Router } from "express";
import {
  AuthMiddleware,
  BlackListMiddleware,
} from "../../middlewares/auth.middleware.js";
import { InterviewReportController } from "../../controllers/interview/interview.controller.js";
import { MulterUpload } from "../../config/multer.config.js";

const router = Router();

router.post(
  "/report",
  BlackListMiddleware,
  AuthMiddleware,
  MulterUpload.single("resume"),
  InterviewReportController,
);

export { router as InterviewRouter };

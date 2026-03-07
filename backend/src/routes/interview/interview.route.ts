import { Router } from "express";
import { AuthMiddleware, BlackListMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();


router.post('/report',BlackListMiddleware,AuthMiddleware)


export { router as InterviewRouter };

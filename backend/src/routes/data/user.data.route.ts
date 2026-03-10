import { Router } from "express";
import { AuthMiddleware, BlackListMiddleware } from "../../middlewares/auth.middleware.js";
import { GetDashboardDataController } from "../../controllers/data/user.data.controller.js";

const router = Router();



router.get('/dashboard',BlackListMiddleware,AuthMiddleware,GetDashboardDataController)

export { router as UserDataRouter };

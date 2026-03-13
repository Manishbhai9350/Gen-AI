import { Router } from "express";
import { GetDashboardDataController, GetPaginatedAnalysesController } from "../../controllers/data/user.data.controller.js";

const router = Router();



router.get('/dashboard',GetDashboardDataController);
router.get('/interview/:id',GetDashboardDataController);
router.get('/analyses',GetPaginatedAnalysesController);


export { router as UserDataRouter };

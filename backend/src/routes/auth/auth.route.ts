import { Router } from "express";
import {
  GetUserController,
  LoginUserController,
  LogoutUserController,
  RegisterUserController,
} from "../../controllers/auth/auth.controller.js";
import {
  AuthMiddleware,
  BlackListMiddleware,
} from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", RegisterUserController);
router.post("/login", LoginUserController);
router.post("/logout", LogoutUserController);
router.get("/me", BlackListMiddleware, AuthMiddleware, GetUserController);

export { router as AuthRouter };

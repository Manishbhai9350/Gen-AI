import { Router } from "express";
import {
  LoginUserController,
  LogoutUserController,
  RegisterUserController,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", RegisterUserController);
router.post("/login", LoginUserController);
router.post("/logout", LogoutUserController);

export { router as AuthRouter };

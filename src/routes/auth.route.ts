import { Router } from "express";
import {
  LoginController,
  RegisterUserController,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", RegisterUserController);
router.post("/login", LoginController);

export { router as AuthRouter };

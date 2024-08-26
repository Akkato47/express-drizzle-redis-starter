import { Router } from "express";
import * as authController from "./auth.controller";
import { isAuthenticated } from "@/middleware/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", isAuthenticated, authController.logout);

export default router;

import { Router } from "express";
import * as UserController from "./user.controller";
import { isAuthenticated } from "@/middleware/auth.middleware";
const router = Router();

router.get("/profile", isAuthenticated, UserController.getUserProfile);

export default router;

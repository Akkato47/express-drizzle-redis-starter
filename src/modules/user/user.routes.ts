import { Router } from "express";
import * as UserController from "./user.controller";
import { isAuthenticated } from "@/middleware/auth.middleware";
const router = Router();

router.get("/", isAuthenticated, UserController.getMe);
router.post("/", UserController.createUser);

export default router;

import { Router } from "express";
import { authenticate, register } from "./auth.controller";

const router = Router();

// Public route
router.post("/login", authenticate);
router.post("/register", register);

export default router;
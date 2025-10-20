import { Router } from "express";
import { authenticate } from "./auth.controller";

const router = Router();

// Public route
router.post("/login", authenticate);

export default router;
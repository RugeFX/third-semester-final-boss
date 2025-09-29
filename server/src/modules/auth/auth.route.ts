import { Router } from "express";
import { authenticate } from "./auth.controller";

const router = Router();

router.post("/login", authenticate);

export default router;
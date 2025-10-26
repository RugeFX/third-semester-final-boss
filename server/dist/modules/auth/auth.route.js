import { Router } from "express";
import { authenticate, register } from "./auth.controller";
const router = Router();
router.post("/login", authenticate);
router.post("/register", register);
export default router;
//# sourceMappingURL=auth.route.js.map
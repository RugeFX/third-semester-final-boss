import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import {
    getAllAuditLogs,
    getAuditLogById,
} from "./audit-log.controller";

const router = Router();

// Admin routes
router.get("/", authenticateJWT, authorizeAdmin, getAllAuditLogs);
router.get("/:id", authenticateJWT, authorizeAdmin, getAuditLogById);

export default router;
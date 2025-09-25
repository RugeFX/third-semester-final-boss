import { Router } from "express";
import {
    getAllAuditLogs,
    getAuditLogById,
    createAuditLog
} from "./audit-log.controller";

const router = Router();

router.get("/", getAllAuditLogs);
router.get("/:id", getAuditLogById);
router.post("/", createAuditLog);

export default router;
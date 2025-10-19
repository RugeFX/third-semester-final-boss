import { Router } from "express";
import {
    getAllAuditLogs,
    getAuditLogById,
} from "./audit-log.controller";

const router = Router();

router.get("/", getAllAuditLogs);
router.get("/:id", getAuditLogById);

export default router;
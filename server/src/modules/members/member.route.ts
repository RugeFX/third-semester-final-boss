import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    renewMembership,
    getMemberTransactions
} from "./member.controller";

const router = Router();

// Admin routes
router.get("/", authenticateJWT, authorizeAdmin, getAllMembers);
router.get("/:id", authenticateJWT, authorizeAdmin, getMemberById);
router.post("/", authenticateJWT, authorizeAdmin, createMember);
router.put("/:id", authenticateJWT, authorizeAdmin, updateMember);
router.delete("/:id", authenticateJWT, authorizeAdmin, deleteMember);

// Member routes
router.post("/me/renew", authenticateJWT, renewMembership);
router.get("/me/transactions", authenticateJWT, getMemberTransactions);

export default router;
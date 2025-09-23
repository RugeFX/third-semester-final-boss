import { Router } from "express";
import {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
} from "./member.controller";

const router = Router();

router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;
import { Router } from "express";
import {
    getAllMembershipPlans,
    getMembershipPlanById,
    createMembershipPlan,
    updateMembershipPlan,
    deleteMembershipPlan
} from "./membership-plan.controller";

const router = Router();

router.get("/", getAllMembershipPlans);
router.get("/:id", getMembershipPlanById);
router.post("/", createMembershipPlan);
router.put("/:id", updateMembershipPlan);
router.delete("/:id", deleteMembershipPlan);

export default router;
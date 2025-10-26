import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import { getAllMembershipPlans, getMembershipPlanById, createMembershipPlan, updateMembershipPlan, deleteMembershipPlan } from "./membership-plan.controller";
const router = Router();
router.get("/", getAllMembershipPlans);
router.get("/:id", getMembershipPlanById);
router.post("/", authenticateJWT, authorizeAdmin, createMembershipPlan);
router.put("/:id", authenticateJWT, authorizeAdmin, updateMembershipPlan);
router.delete("/:id", authenticateJWT, authorizeAdmin, deleteMembershipPlan);
export default router;
//# sourceMappingURL=membership-plan.route.js.map
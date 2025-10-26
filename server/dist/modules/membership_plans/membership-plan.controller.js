import membershipPlanService from "./membership-plan.service";
import { paramsSchema, createMembershipPlanSchema, updateMembershipPlanSchema } from "./membership-plan.schema";
import HttpError from "../../common/exceptions/http.error";
export const getAllMembershipPlans = async (_req, res) => {
    const membershipPlans = await membershipPlanService.getAllMembershipPlans();
    return res.status(200).json({
        success: true,
        message: "Membership plans fetched successfully",
        data: membershipPlans
    });
};
export const getMembershipPlanById = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const membershipPlan = await membershipPlanService.findMembershipPlanById(id);
    return res.status(200).json({
        success: true,
        message: "Membership plan fetched successfully",
        data: membershipPlan
    });
};
export const createMembershipPlan = async (req, res) => {
    const membershipPlanData = createMembershipPlanSchema.parse(req.body);
    const newMembershipPlan = await membershipPlanService.createMembershipPlan(membershipPlanData);
    if (!newMembershipPlan)
        throw new HttpError(500, "Failed to create membership plan");
    return res.status(201).json({
        success: true,
        message: "Membership plan created successfully",
        data: newMembershipPlan
    });
};
export const updateMembershipPlan = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const membershipPlanData = updateMembershipPlanSchema.parse(req.body);
    const adminUserId = req.user.id;
    const updatedMembershipPlan = await membershipPlanService.updateMembershipPlan(id, membershipPlanData, adminUserId);
    if (!updatedMembershipPlan)
        throw new HttpError(500, "Failed to update membership plan");
    return res.status(200).json({
        success: true,
        message: "Membership plan updated successfully",
        data: updatedMembershipPlan
    });
};
export const deleteMembershipPlan = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const adminUserId = req.user.id;
    const deletedMembershipPlan = await membershipPlanService.deleteMembershipPlan(id, adminUserId);
    if (!deletedMembershipPlan)
        throw new HttpError(500, "Failed to delete membership plan");
    return res.status(200).json({
        success: true,
        message: "Membership plan deleted successfully",
        data: deletedMembershipPlan
    });
};
//# sourceMappingURL=membership-plan.controller.js.map
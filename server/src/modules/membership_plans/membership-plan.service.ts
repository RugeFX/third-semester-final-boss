import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
import membershipPlanRepository from "./membership-plan.repository";
import { createMembershipPlanSchema, updateMembershipPlanSchema } from "./membership-plan.schema";
import { z } from "zod";

type createMembershipPlanInput = z.infer<typeof createMembershipPlanSchema>;
type updateMembershipPlanInput = z.infer<typeof updateMembershipPlanSchema>;

// Get all membership plans
export const getAllMembershipPlans = async () => {
    const membershipPlans = await membershipPlanRepository.findAll();
    
    return membershipPlans;
};

// Find membership plan by ID
export const findMembershipPlanById = async (membershipPlanId: number) => {
    const membershipPlan = await membershipPlanRepository.findById(membershipPlanId);

    if (!membershipPlan) throw new HttpError(404, "Membership plan not found");

    return membershipPlan;
};

// Create a membership plans
export const createMembershipPlan = async (membershipPlanData: createMembershipPlanInput) => {
    return await membershipPlanRepository.create(membershipPlanData);
};

// Update a membership plan
export const updateMembershipPlan = async (
    membershipPlanId: number, 
    membershipPlanData: updateMembershipPlanInput, 
    adminUserId: number
) => {
    const oldMembershipPlan = await findMembershipPlanById(membershipPlanId);

    const updatedMembershipPlan = await membershipPlanRepository.update(membershipPlanId, membershipPlanData);

    // Create audit log for update
    try {
        await auditLogService.createAuditLog({
            context: `Admin updated membership plan (ID: ${membershipPlanId}). Old Data: ${JSON.stringify(oldMembershipPlan)}, New Data: ${JSON.stringify(updatedMembershipPlan)}`,
            type: "MEMBERSHIP_PLAN_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for membership plan update:", error);
    }

    return updatedMembershipPlan;
};

// Delete a membership plan
export const deleteMembershipPlan = async (membershipPlanId: number, adminUserId: number) => {
    await findMembershipPlanById(membershipPlanId);

    const deletedMembershipPlan = await membershipPlanRepository.remove(membershipPlanId);

    // Create audit log for deletion
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted membership plan (ID: ${membershipPlanId}). Data: ${JSON.stringify(deletedMembershipPlan)}`,
            type: "MEMBERSHIP_PLAN_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for membership plan deletion:", error);
    }

    return deletedMembershipPlan;
};
   
export default { getAllMembershipPlans, findMembershipPlanById, createMembershipPlan, updateMembershipPlan, deleteMembershipPlan };
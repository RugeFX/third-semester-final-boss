import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
import membershipPlanRepository from "./membership-plan.repository";
export const getAllMembershipPlans = async () => {
    const membershipPlans = await membershipPlanRepository.findAll();
    return membershipPlans;
};
export const findMembershipPlanById = async (membershipPlanId) => {
    const membershipPlan = await membershipPlanRepository.findById(membershipPlanId);
    if (!membershipPlan)
        throw new HttpError(404, "Membership plan not found");
    return membershipPlan;
};
export const createMembershipPlan = async (membershipPlanData) => {
    return await membershipPlanRepository.create(membershipPlanData);
};
export const updateMembershipPlan = async (membershipPlanId, membershipPlanData, adminUserId) => {
    const oldMembershipPlan = await findMembershipPlanById(membershipPlanId);
    const updatedMembershipPlan = await membershipPlanRepository.update(membershipPlanId, membershipPlanData);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated membership plan (ID: ${membershipPlanId}). Old Data: ${JSON.stringify(oldMembershipPlan)}, New Data: ${JSON.stringify(updatedMembershipPlan)}`,
            type: "MEMBERSHIP_PLAN_UPDATE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for membership plan update:", error);
    }
    return updatedMembershipPlan;
};
export const deleteMembershipPlan = async (membershipPlanId, adminUserId) => {
    await findMembershipPlanById(membershipPlanId);
    const deletedMembershipPlan = await membershipPlanRepository.remove(membershipPlanId);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted membership plan (ID: ${membershipPlanId}). Data: ${JSON.stringify(deletedMembershipPlan)}`,
            type: "MEMBERSHIP_PLAN_DELETE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for membership plan deletion:", error);
    }
    return deletedMembershipPlan;
};
export default { getAllMembershipPlans, findMembershipPlanById, createMembershipPlan, updateMembershipPlan, deleteMembershipPlan };
//# sourceMappingURL=membership-plan.service.js.map
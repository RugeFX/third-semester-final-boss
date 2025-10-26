import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
import memberRepository from "./member.repository";
import membershipPlanService from "../membership_plans/membership-plan.service";
import transactionService from "../transactions/transaction.service";
import userService from "../users/user.service";
export const getAllMembers = async () => {
    const members = await memberRepository.findAll();
    return members;
};
export const findMemberById = async (id) => {
    const member = await memberRepository.findById(id);
    if (!member)
        throw new HttpError(404, "Member not found");
    return member;
};
export const findMemberByUserId = async (userId) => {
    const member = await memberRepository.findByUserId(userId);
    if (!member)
        throw new HttpError(404, "Member not found");
    return member;
};
export const getTransactionForMember = async (userId) => {
    const user = await userService.findUserById(userId);
    const transactions = await transactionService.getTransactionsByUserId(user.id);
    return transactions;
};
export const createMember = async (memberData) => {
    return await memberRepository.create(memberData);
};
export const updateMember = async (memberId, memberData, adminUserId) => {
    const oldMember = await findMemberById(memberId);
    const updatedMember = await memberRepository.update(memberId, memberData);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated member (ID: ${memberId}). Old Data: ${JSON.stringify(oldMember)}, New Data: ${JSON.stringify(updatedMember)}`,
            type: "MEMBER_UPDATE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for member update:", error);
    }
    return updatedMember;
};
export const renewMembership = async (userId, renewalData) => {
    let member = await memberRepository.findByUserId(userId);
    if (!member) {
        const user = await userService.findUserById(userId);
        const newMember = await createMember({
            userId: user.id,
            endedAt: new Date()
        });
        member = { ...newMember, user: user };
    }
    const { membershipPlanId } = renewalData;
    const membershipPlan = await membershipPlanService.findMembershipPlanById(membershipPlanId);
    const now = new Date();
    const base = new Date(member.ended_at) > now ? new Date(member.ended_at) : now;
    const newEndDate = new Date(base);
    newEndDate.setMonth(newEndDate.getMonth() + membershipPlan.period);
    const updatedMember = await memberRepository.update(member.id, {
        endedAt: newEndDate
    });
    return updatedMember;
};
export const deleteMember = async (memberId, adminUserId) => {
    await findMemberById(memberId);
    const deletedMember = await memberRepository.remove(memberId);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted member (ID: ${memberId}). Data: ${JSON.stringify(deletedMember)}`,
            type: "MEMBER_DELETE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for member deletion:", error);
    }
    return deletedMember;
};
export default { getAllMembers, findMemberById, findMemberByUserId, getTransactionForMember, createMember, updateMember, renewMembership, deleteMember };
//# sourceMappingURL=member.service.js.map
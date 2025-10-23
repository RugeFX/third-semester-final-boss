import HttpError from "../../common/exceptions/http.error";
import { createMemberSchema, updateMemberSchema, renewMembershipSchema } from "./member.schema";
import auditLogService from "../audit_logs/audit-log.service";
import memberRepository from "./member.repository";
import membershipPlanService from "../membership_plans/membership-plan.service";
import transactionService from "../transactions/transaction.service";   
import userService from "../users/user.service";
import { z } from "zod";

type createMemberInput = z.infer<typeof createMemberSchema>;
type updateMemberInput = z.infer<typeof updateMemberSchema>;
type renewMembershipInput = z.infer<typeof renewMembershipSchema>;

// Get all members
export const getAllMembers = async () => {
    const members = await memberRepository.findAll();

    return members;
};

// Get member by ID
export const findMemberById = async (id: number) => {
    const member = await memberRepository.findById(id);

    if (!member) throw new HttpError(404, "Member not found");

    return member;
};

// Get member by user ID
export const findMemberByUserId = async (userId: number) => {
    const member = await memberRepository.findByUserId(userId);
    
    if (!member) throw new HttpError(404, "Member not found");

    return member;
};

// Get member transactions
export const getTransactionForMember = async (userId: number) => {
    const user = await userService.findUserById(userId);

    const transactions = await transactionService.getTransactionsByUserId(user.id);

    return transactions;
}

// Create a new member
export const createMember = async (memberData: createMemberInput) => {
    return await memberRepository.create(memberData);
};

// Update a member
export const updateMember = async (memberId: number, memberData: updateMemberInput, adminUserId: number) => {
    const oldMember = await findMemberById(memberId);

    const updatedMember = await memberRepository.update(memberId, memberData);

    // Create audit log for update
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated member (ID: ${memberId}). Old Data: ${JSON.stringify(oldMember)}, New Data: ${JSON.stringify(updatedMember)}`,
            type: "MEMBER_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for member update:", error);
    }

    return updatedMember;
};

// Renew membership subscription
export const renewMembership = async (userId: number, renewalData: renewMembershipInput) => {
    const member = await findMemberByUserId(userId);
    const { membershipPlanId } = renewalData;

    // Fetch membership plan details
    const membershipPlan = await membershipPlanService.findMembershipPlanById(membershipPlanId);

    const now = new Date();
    // Determine the new end date based on current end date or now
    const base = new Date(member.ended_at) > now ? new Date(member.ended_at) : now;
    // Calculate new end date
    const newEndDate = new Date(base);
    newEndDate.setMonth(newEndDate.getMonth() + membershipPlan.period);

    const updatedMember = await memberRepository.update(member.id, {
        endedAt: newEndDate
    });

    return updatedMember;
};

// Delete a member
export const deleteMember = async (memberId: number, adminUserId: number) => {
    await findMemberById(memberId);

    const deletedMember = await memberRepository.remove(memberId);

    // Create audit log for deletion
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted member (ID: ${memberId}). Data: ${JSON.stringify(deletedMember)}`,
            type: "MEMBER_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for member deletion:", error);
    }

    return deletedMember;
};

export default { getAllMembers, findMemberById, findMemberByUserId, getTransactionForMember, createMember, updateMember, renewMembership, deleteMember };
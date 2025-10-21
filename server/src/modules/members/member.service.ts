import HttpError from "../../common/exceptions/http.error";
import { createMemberSchema, updateMemberSchema, renewMembershipSchema } from "./member.schema";
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
export const updateMember = async (memberId: number, memberData: updateMemberInput) => {
    await findMemberById(memberId);

    return await memberRepository.update(memberId, memberData);
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
export const deleteMember = async (memberId: number) => {
    await findMemberById(memberId);

    return await memberRepository.remove(memberId);
};

export default { getAllMembers, findMemberById, getTransactionForMember, createMember, updateMember, renewMembership, deleteMember };
import HttpError from "../../common/exceptions/http.error";
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
export const updateMembershipPlan = async (membershipPlanId: number, membershipPlanData: updateMembershipPlanInput) => {
    await findMembershipPlanById(membershipPlanId);

    return await membershipPlanRepository.update(membershipPlanId, membershipPlanData);
};

// Delete a membership plan
export const deleteMembershipPlan = async (membershipPlanId: number) => {
    await findMembershipPlanById(membershipPlanId);

    return await membershipPlanRepository.remove(membershipPlanId);
};
   
export default { getAllMembershipPlans, findMembershipPlanById, createMembershipPlan, updateMembershipPlan, deleteMembershipPlan };
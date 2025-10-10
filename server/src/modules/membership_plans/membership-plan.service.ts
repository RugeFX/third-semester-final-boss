import { db } from "../../db";
import HttpError from "../common/exceptions/http.error";
import { eq } from "drizzle-orm";
import { membershipPlansTable } from "../../db/schema";

// Get all membership plans
export const getAllMembershipPlans = async () => {
    const membershipPlans = await db.query.membershipPlansTable.findMany();
    
    return membershipPlans;
};

// Find membership plan by ID
export const findMembershipPlanById = async (membershipPlanId: number) => {
    const membershipPlan = await db.query.membershipPlansTable.findFirst({
        where: eq(membershipPlansTable.id, membershipPlanId)
    });

    if (!membershipPlan) throw new HttpError(404, "Membership plan not found");

    return membershipPlan;
};

// Create a membership plans
export const createMembershipPlan = async (cost: number, period: number) => {
    const [ newMembershipPlan ] = await db.insert(membershipPlansTable).values({ 
        cost: cost.toString(), 
        period 
    }).returning();

    return newMembershipPlan;
};

// Update a membership plan
export const updateMembershipPlan = async (membershipPlanId: number, cost: number, period: number) => {
    await findMembershipPlanById(membershipPlanId);

    const [ updatedMembershipPlan ] = await db.update(membershipPlansTable).set({ 
        cost: cost.toString(), 
        period 
    }).where(eq(membershipPlansTable.id, membershipPlanId)).returning();

    return updatedMembershipPlan;
};

// Delete a membership plan
export const deleteMembershipPlan = async (membershipPlanId: number) => {
    await findMembershipPlanById(membershipPlanId);

    const deletedMembershipPlan = await db.delete(membershipPlansTable).where(eq(membershipPlansTable.id, membershipPlanId));

    return deletedMembershipPlan;
};
   
export default { getAllMembershipPlans, findMembershipPlanById, createMembershipPlan, updateMembershipPlan, deleteMembershipPlan };
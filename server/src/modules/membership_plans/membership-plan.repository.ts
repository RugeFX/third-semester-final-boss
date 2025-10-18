import { db } from "../../db";
import { eq } from "drizzle-orm";
import { membershipPlansTable } from "../../db/schema";
import { createMembershipPlanSchema, updateMembershipPlanSchema } from "./membership-plan.schema";
import { z } from "zod";

type newMembershipPlan = z.infer<typeof createMembershipPlanSchema>;
type updatedMembershipPlan = z.infer<typeof updateMembershipPlanSchema>;

// Get all membership plans
export const findAll = async () => {
    return await db.query.membershipPlansTable.findMany();
}

// Find membership plan by ID
export const findById = async (membershipPlanId: number) => {
    return await db.query.membershipPlansTable.findFirst({
        where: eq(membershipPlansTable.id, membershipPlanId)
    });
}

// Create a membership plan
export const create = async (membershipPlanData: newMembershipPlan) => {
    const [ newMembershipPlan ] = await db.insert(membershipPlansTable).values({
        cost: membershipPlanData.cost.toString(),
        period: membershipPlanData.period
    }).returning();

    return newMembershipPlan;
}

// Update a membership plan
export const update = async (membershipPlanId: number, membershipPlanData: updatedMembershipPlan) => {
    const [ updatedMembershipPlan ] = await db.update(membershipPlansTable).set({
        cost: membershipPlanData.cost.toString(),
        period: membershipPlanData.period
    }).where(eq(membershipPlansTable.id, membershipPlanId)).returning();

    return updatedMembershipPlan;
}

// Delete a membership plan
export const remove = async (membershipPlanId: number) => {
    return await db.delete(membershipPlansTable).where(
        eq(membershipPlansTable.id, membershipPlanId)
    ).returning();
}

export default { findAll, findById, create, update, remove };
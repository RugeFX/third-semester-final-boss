import { db } from "../../db";
import { eq } from "drizzle-orm";
import { membershipPlansTable } from "../../db/schema";
export const findAll = async () => {
    return await db.query.membershipPlansTable.findMany();
};
export const findById = async (membershipPlanId) => {
    return await db.query.membershipPlansTable.findFirst({
        where: eq(membershipPlansTable.id, membershipPlanId)
    });
};
export const create = async (membershipPlanData) => {
    const [newMembershipPlan] = await db.insert(membershipPlansTable).values({
        cost: membershipPlanData.cost.toString(),
        period: membershipPlanData.period
    }).returning();
    return newMembershipPlan;
};
export const update = async (membershipPlanId, membershipPlanData) => {
    const [updatedMembershipPlan] = await db.update(membershipPlansTable).set({
        cost: membershipPlanData.cost.toString(),
        period: membershipPlanData.period
    }).where(eq(membershipPlansTable.id, membershipPlanId)).returning();
    return updatedMembershipPlan;
};
export const remove = async (membershipPlanId) => {
    const [deletedMembershipPlan] = await db.delete(membershipPlansTable).where(eq(membershipPlansTable.id, membershipPlanId)).returning();
    return deletedMembershipPlan;
};
export default { findAll, findById, create, update, remove };
//# sourceMappingURL=membership-plan.repository.js.map
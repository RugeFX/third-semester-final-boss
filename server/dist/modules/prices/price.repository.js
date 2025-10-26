import { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { pricesTable } from "../../db/schema";
export const findAll = async () => {
    return await db.query.pricesTable.findMany({
        with: {
            category: true
        }
    });
};
export const findAllByCategoryId = async (categoryId) => {
    return await db.query.pricesTable.findMany({
        where: eq(pricesTable.category_id, categoryId),
        with: {
            category: true
        }
    });
};
export const findById = async (priceId) => {
    return await db.query.pricesTable.findFirst({
        where: eq(pricesTable.id, priceId),
        with: {
            category: true
        }
    });
};
export const findActivePriceByCategoryAndType = async (category_id, type) => {
    return await db.query.pricesTable.findFirst({
        where: and(eq(pricesTable.category_id, category_id), eq(pricesTable.type, type), eq(pricesTable.is_active, true))
    });
};
export const create = async (priceData) => {
    const [newPrice] = await db.insert(pricesTable).values({
        category_id: priceData.categoryId,
        amount: priceData.amount.toString(),
        type: priceData.type,
        block_hours: priceData.blockHours,
        is_active: priceData.isActive,
        valid_from: priceData.validFrom,
        valid_until: priceData.validUntil
    }).returning();
    return newPrice;
};
export const update = async (priceId, priceData) => {
    const [updatedPrice] = await db.update(pricesTable).set({
        category_id: priceData.categoryId,
        amount: priceData.amount.toString(),
        type: priceData.type,
        block_hours: priceData.blockHours,
        is_active: priceData.isActive,
        valid_from: priceData.validFrom,
        valid_until: priceData.validUntil
    }).where(eq(pricesTable.id, priceId)).returning();
    return updatedPrice;
};
export const remove = async (priceId) => {
    const [deletedPrice] = await db.delete(pricesTable).where(eq(pricesTable.id, priceId)).returning();
    return deletedPrice;
};
export default { findAll, findAllByCategoryId, findById, findActivePriceByCategoryAndType, create, update, remove };
//# sourceMappingURL=price.repository.js.map
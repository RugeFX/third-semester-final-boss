import  { db } from "../../db";
import { eq, and } from "drizzle-orm";
import { pricesTable } from "../../db/schema";
import { createPriceSchema, updatePriceSchema } from "./price.schema";
import { z } from "zod";

type newPrice = z.infer<typeof createPriceSchema>;
type updatedPrice = z.infer<typeof updatePriceSchema>;

// Get all prices
export const findAll = async () => {
    return await db.query.pricesTable.findMany({
        with: {
            category: true
        }
    });
}

// Find price by ID
export const findById = async (priceId: number) => {
    return await db.query.pricesTable.findFirst({
        where: eq(pricesTable.id, priceId),
        with: {
            category: true
        }
    });
}

// Find active price by category and type
export const findActivePriceByCategoryAndType = async (category_id: number, type: string) => {
    return await db.query.pricesTable.findFirst({
        where: and(
            eq(pricesTable.category_id, category_id),
            eq(pricesTable.type, type),
            eq(pricesTable.is_active, true)
        )
    });
}

// Create a price
export const create = async (priceData: newPrice) => {
    const [ newPrice ] = await db.insert(pricesTable).values({
        category_id: priceData.categoryId,
        amount: priceData.amount.toString(),
        type: priceData.type,
        block_hours: priceData.blockHours,
        is_active: priceData.isActive,
        valid_from: priceData.validFrom,
        valid_until: priceData.validUntil
    }).returning();

    return newPrice;
}

// Update a price
export const update = async (priceId: number, priceData: updatedPrice) => {
    const [ updatedPrice ] = await db.update(pricesTable).set({
        category_id: priceData.categoryId,
        amount: priceData.amount.toString(),
        type: priceData.type,
        block_hours: priceData.blockHours,
        is_active: priceData.isActive,
        valid_from: priceData.validFrom,
        valid_until: priceData.validUntil
    }).where(eq(pricesTable.id, priceId)).returning();

    return updatedPrice;
}

// Delete a price
export const remove = async (priceId: number) => {
    return await db.delete(pricesTable).where(eq(pricesTable.id, priceId)).returning();
}

export default { findAll, findById, findActivePriceByCategoryAndType, create, update, remove };
import { db } from "../../db";
import HttpError from "../common/exceptions/http.error";
import { eq, and } from "drizzle-orm";
import categoryService from "../categories/category.service";
import { pricesTable } from "../../db/schema";

// Get all prices with category
export const getAllPrices = async () => {
    const prices = await db.query.pricesTable.findMany({
        with: {
            category: true
        }
    });

    return prices;
};

// Find price by ID
export const findPriceById = async (priceId: number) => {
    const price = await db.query.pricesTable.findFirst({
        where: eq(pricesTable.id, priceId),
        with: {
            category: true
        }
    });

    if (!price) throw new HttpError(404, "Price not found");

    return price;
};

export const findActivePriceByCategoryAndType = async (category_id: number, type: string) => {
    const price = await db.query.pricesTable.findFirst({
        where: and(
            eq(pricesTable.category_id, category_id),
            eq(pricesTable.type, type),
            eq(pricesTable.is_active, true)
        )
    });

    return price;
}

// Create a new price
export const createPrice = async (amount: number, category_id: number, type: string, blockHours?: number, isActive?: boolean, validFrom?: Date | null, validUntil?: Date | null) => {
    await categoryService.findCategoryById(category_id);

    if (isActive !== false) {
        if (await findActivePriceByCategoryAndType(category_id, type))
            throw new HttpError(409, `Price with type '${type}' for this category already exists and is active`);
    }

    const [ newPrice ] = await db.insert(pricesTable).values({
        category_id: category_id,
        amount: amount.toString(),
        type: type,
        block_hours: blockHours,
        is_active: isActive,
        valid_from: validFrom,
        valid_until: validUntil
    }).returning();

    return newPrice;
};

// Update a price
export const updatePrice = async (priceId: number, amount: number, category_id: number, type: string, blockHours?: number, isActive?: boolean, validFrom?: Date | null, validUntil?: Date | null) => {
    await findPriceById(priceId);
    await categoryService.findCategoryById(category_id);

    if (isActive !== false) {
        const existingPrice = await findActivePriceByCategoryAndType(category_id, type);

        if (existingPrice && existingPrice.id !== priceId)
            throw new HttpError(409, `Price with type '${type}' for this category already exists and is active`);
    }

    const [ updatedPrice ] = await db.update(pricesTable).set({
        amount: amount.toString(),
        category_id: category_id,
        type: type,
        block_hours: blockHours,
        is_active: isActive,
        valid_from: validFrom,
        valid_until: validUntil
    }).where(eq(pricesTable.id, priceId)).returning();

    return updatedPrice;
}

// Delete a price
export const deletePrice = async (priceId: number) => {
    await findPriceById(priceId);

    const [ deletedPrice ]  = await db.delete(pricesTable).where(eq(pricesTable.id, priceId)).returning();

    return deletedPrice;
};

export default { getAllPrices, findPriceById, createPrice, updatePrice, deletePrice };
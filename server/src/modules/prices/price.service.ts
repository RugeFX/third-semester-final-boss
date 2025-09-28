import { db } from "../../db";
import HttpError from "../common/exceptions/http.error";
import { eq } from "drizzle-orm";
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

// Create a new price
export const createPrice = async (amount: number, category_id: number) => {
    await categoryService.findCategoryById(category_id);

    const newPrice = await db.insert(pricesTable).values({
        amount,
        category_id
    }).returning();

    return newPrice;
};

// Update a price
export const updatePrice = async (priceId: number, amount: number, category_id: number) => {
    await findPriceById(priceId);
    await categoryService.findCategoryById(category_id);

    const updatedPrice = await db.update(pricesTable).set({
        amount,
        category_id
    }).where(eq(pricesTable.id, priceId)).returning();

    return updatedPrice;
}

// Delete a price
export const deletePrice = async (priceId: number) => {
    await findPriceById(priceId);

    const deletedPrice = await db.delete(pricesTable).where(eq(pricesTable.id, priceId));

    return deletedPrice;
};

export default { getAllPrices, findPriceById, createPrice, updatePrice, deletePrice };
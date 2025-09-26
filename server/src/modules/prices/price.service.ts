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
    const checkCategory = await categoryService.findCategoryById(category_id);

    if (!checkCategory) throw new HttpError(400, "Category not found");

    const newPrice = await db.insert(pricesTable).values({
        amount,
        category_id
    });

    if (!newPrice) throw new HttpError(500, "Failed to create price");

    return newPrice;
};

// Update a price
export const updatePrice = async (priceId: number, amount: number, category_id: number) => {
    const checkCategory = await categoryService.findCategoryById(category_id);

    if (!checkCategory) throw new HttpError(400, "Category not found");

    const updatedPrice = await db.update(pricesTable).set({
        amount,
        category_id
    }).where(eq(pricesTable.id, priceId));

    if (!updatedPrice) throw new HttpError(500, "Failed to update price");

    return updatePrice;
}

// Delete a price
export const deletePrice = async (priceId: number) => {
    const price = await findPriceById(priceId);

    if (!price) throw new HttpError(404, "Price not found");

    const deletedPrice = await db.delete(pricesTable).where(eq(pricesTable.id, priceId));

    return deletedPrice;
};

export default { getAllPrices, findPriceById, createPrice, updatePrice, deletePrice };
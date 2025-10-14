import { db } from "../../db";
import { eq } from "drizzle-orm";
import { categoriesTable } from "../../db/schema";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import { z } from "zod";

type newCategory = z.infer<typeof createCategorySchema>;
type updatedCategory = z.infer<typeof updateCategorySchema>;

// Get all categories
export const findAll = async () => {
    return await db.query.categoriesTable.findMany();
}

// Find category by ID
export const findById = async (categoryId: number) => {
    return await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, categoryId)
    });
}

// Create a category
export const create = async (categoryData: newCategory) => {
    const [ newCategory ] = await db.insert(categoriesTable).values({
        name: categoryData.name,
        weight: categoryData.weight.toString(),
        icon: categoryData.icon,
        thumbnail: categoryData.thumbnail
    }).returning();

    return newCategory;
}

// Update a category
export const update = async (categoryId: number, categoryData: updatedCategory) => {
    const [ updatedCategory ] = await db.update(categoriesTable).set({
        name: categoryData.name,
        weight: categoryData.weight.toString(),
        icon: categoryData.icon,
        thumbnail: categoryData.thumbnail
    }).where(eq(categoriesTable.id, categoryId)).returning();

    return updatedCategory;
}

// Delete a category
export const remove = async (categoryId: number) => {
    return await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId));
}

export default { findAll, findById, create, update, remove };
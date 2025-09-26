import { db } from "../../db";
import { categoriesTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import HttpError from "../common/exceptions/http.error";

// Get all categories
export const getAllCategories = async () => {
    const categories = await db.query.categoriesTable.findMany();

    if (!categories) throw new HttpError(404, "Categories not found");

    return categories;
};

// Find category by ID
export const findCategoryById = async (categoryId: number) => {
    const category = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, categoryId)
    });

    if (!category) throw new HttpError(400, "Category not found");

    return category;
};

// Create a category
export const createCategory = async (name: string, weight: number) => {
    const newCategory = await db.insert(categoriesTable).values({
        name,
        weight
    });

    return newCategory;
};

// Update a category
export const updateCategory = async (categoryId: number, name: string, weight: number) => {
    const updatedCategory = await db.update(categoriesTable).set({
        name,
        weight
    }).where(eq(categoriesTable.id, categoryId));

    return updatedCategory;
};

// Delete a category
export const deleteCategory = async (categoryId: number) => {
    const category = await findCategoryById(categoryId);

    if (!category) throw new Error("Category not found");

    const deletedCategory = await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId));

    return deletedCategory;
};

export default { getAllCategories, findCategoryById, createCategory, updateCategory, deleteCategory };
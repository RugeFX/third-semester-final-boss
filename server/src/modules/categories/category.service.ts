import { z } from "zod";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import categoryRepository from "./category.repository";
import HttpError from "../../common/exceptions/http.error";

type createCategoryInput = z.infer<typeof createCategorySchema>;
type updateCategoryInput = z.infer<typeof updateCategorySchema>;

// Get all categories
export const getAllCategories = async () => {
    return await categoryRepository.findAll();
};

// Find category by ID
export const findCategoryById = async (categoryId: number) => {
    const category = await categoryRepository.findById(categoryId);

    if (!category) throw new HttpError(404, "Category not found");

    return category;
};

// Create a category
export const createCategory = async (categoryData: createCategoryInput) => {
    return await categoryRepository.create(categoryData);
};

// Update a category
export const updateCategory = async (categoryId: number, categoryData: updateCategoryInput) => {
    await findCategoryById(categoryId);

    return await categoryRepository.update(categoryId, categoryData);
};

// Delete a category
export const deleteCategory = async (categoryId: number) => {
    await findCategoryById(categoryId);

    return await categoryRepository.remove(categoryId);
};

export default { getAllCategories, findCategoryById, createCategory, updateCategory, deleteCategory };
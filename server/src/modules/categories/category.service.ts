import { z } from "zod";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import auditLogService from "../audit_logs/audit-log.service";
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
export const updateCategory = async (categoryId: number, categoryData: updateCategoryInput, adminUserId: number) => {
    const oldCategory = await findCategoryById(categoryId);

    const updatedCategory = await categoryRepository.update(categoryId, categoryData);

    // Create audit log for update
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated category (ID: ${categoryId}). Old Data: ${JSON.stringify(oldCategory)}, New Data: ${JSON.stringify(updatedCategory)}`,
            type: "CATEGORY_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for category update:", error);
    }

    return updatedCategory;
};

// Delete a category
export const deleteCategory = async (categoryId: number, adminUserId: number) => {
    await findCategoryById(categoryId);

    const deletedCategory = await categoryRepository.remove(categoryId);

    // Create audit log for deletion
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted category (ID: ${categoryId}). Data: ${JSON.stringify(deletedCategory)}`,
            type: "CATEGORY_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for category deletion:", error);
    }

    return deletedCategory;
};

export default { getAllCategories, findCategoryById, createCategory, updateCategory, deleteCategory };
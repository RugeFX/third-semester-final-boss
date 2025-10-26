import auditLogService from "../audit_logs/audit-log.service";
import categoryRepository from "./category.repository";
import HttpError from "../../common/exceptions/http.error";
export const getAllCategories = async () => {
    return await categoryRepository.findAll();
};
export const findCategoryById = async (categoryId) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category)
        throw new HttpError(404, "Category not found");
    return category;
};
export const createCategory = async (categoryData) => {
    return await categoryRepository.create(categoryData);
};
export const updateCategory = async (categoryId, categoryData, adminUserId) => {
    const oldCategory = await findCategoryById(categoryId);
    const updatedCategory = await categoryRepository.update(categoryId, categoryData);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated category (ID: ${categoryId}). Old Data: ${JSON.stringify(oldCategory)}, New Data: ${JSON.stringify(updatedCategory)}`,
            type: "CATEGORY_UPDATE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for category update:", error);
    }
    return updatedCategory;
};
export const deleteCategory = async (categoryId, adminUserId) => {
    await findCategoryById(categoryId);
    const deletedCategory = await categoryRepository.remove(categoryId);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted category (ID: ${categoryId}). Data: ${JSON.stringify(deletedCategory)}`,
            type: "CATEGORY_DELETE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for category deletion:", error);
    }
    return deletedCategory;
};
export default { getAllCategories, findCategoryById, createCategory, updateCategory, deleteCategory };
//# sourceMappingURL=category.service.js.map
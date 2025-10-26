import categoryService from "./category.service";
import { paramsSchema, createCategorySchema, updateCategorySchema } from "./category.schema";
import HttpError from "../../common/exceptions/http.error";
export const getAllCategories = async (_req, res) => {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: categories
    });
};
export const getCategoryById = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const category = await categoryService.findCategoryById(id);
    res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        data: category
    });
};
export const createCategory = async (req, res) => {
    const categoryData = createCategorySchema.parse(req.body);
    const newCategory = await categoryService.createCategory(categoryData);
    if (!newCategory)
        throw new HttpError(500, "Failed to create category");
    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: newCategory
    });
};
export const updateCategory = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const categoryData = updateCategorySchema.parse(req.body);
    const adminUserId = req.user.id;
    const updatedCategory = await categoryService.updateCategory(id, categoryData, adminUserId);
    if (!updatedCategory)
        throw new HttpError(500, "Failed to update category");
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory
    });
};
export const deleteCategory = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const adminUserId = req.user.id;
    const deletedCategory = await categoryService.deleteCategory(id, adminUserId);
    if (!deletedCategory)
        throw new HttpError(500, "Failed to delete category");
    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: deletedCategory
    });
};
//# sourceMappingURL=category.controller.js.map
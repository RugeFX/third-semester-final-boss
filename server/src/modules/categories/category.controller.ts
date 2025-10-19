import { Request, Response } from "express";
import categoryService from "./category.service";
import { paramsSchema, createCategorySchema, updateCategorySchema } from "./category.schema";
import HttpError from "../../common/exceptions/http.error";

// Get all categories
export const getAllCategories = async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: categories
    });
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const category = await categoryService.findCategoryById(id);

    res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        data: category
    });
};

// Create a category
export const createCategory = async (req: Request, res: Response) => {
    const categoryData = createCategorySchema.parse(req.body);

    const newCategory = await categoryService.createCategory(categoryData);

    if (!newCategory) throw new HttpError(500, "Failed to create category");

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: newCategory
    });
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const categoryData = updateCategorySchema.parse(req.body);

    const updatedCategory = await categoryService.updateCategory(id, categoryData);

    if (!updatedCategory) throw new HttpError(500, "Failed to update category");

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory
    });
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const deletedCategory = await categoryService.deleteCategory(id);

    if (!deletedCategory) throw new HttpError(500, "Failed to delete category");

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: deletedCategory
    });
};
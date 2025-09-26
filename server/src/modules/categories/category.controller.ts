import { Request, Response } from "express";
import categoryService from "./category.service";
import HttpError from "../common/exceptions/http.error";
import { success } from "zod";

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    if (!categories) throw new HttpError(404, "Categories not found");

    res.json({
        success: true,
        code: 200,
        message: "Categories fetched successfully",
        data: categories
    });
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    const category = await categoryService.findCategoryById(Number(req.params.id));

    if (!category) throw new HttpError(404, "Category not found");

    res.json({
        success: true,
        code: 200,
        message: "Category fetched successfully",
        data: category
    });
};

// Create a category
export const createCategory = async (req: Request, res: Response) => {
    const { name, weight } = req.body;

    const newCategory = await categoryService.createCategory(name, weight);

    if (!newCategory) throw new HttpError(500, "Failed to create category");

    res.json({
        success: true,
        code: 200,
        message: "Category created successfully",
        data: newCategory
    });
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
    const { name, weight } = req.body;

    const updatedCategory = await categoryService.updateCategory(Number(req.params.id), name, weight);

    if (!updatedCategory) throw new HttpError(500, "Failed to update category");

    res.json({
        success: true,
        code: 200,
        message: "Category updated successfully",
        data: updatedCategory
    });
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
    const deletedCategory = await categoryService.deleteCategory(Number(req.params.id));

    if (!deletedCategory) throw new HttpError(500, "Failed to delete category");

    res.json({
        success: true,
        code: 200,
        message: "Category deleted successfully"
    });
};
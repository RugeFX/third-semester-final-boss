import { Request, Response } from "express";

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
    const categories = [
        {
            id: 1,
            name: "Car",
            weight: 200
        },
        {
            id: 2,
            name: "Motorcycle",
            weight: 100
        }
    ];

    res.json({
        success: true,
        code: 200,
        message: "Categories fetched successfully",
        data: categories
    });
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    const category = {
        id: 2,
        name: "Motorcycle",
        weight: 200
    };

    res.json({
        success: true,
        code: 200,
        message: "Category fetched successfully",
        data: category
    });
}

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
    const { name, weight } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Category created successfully",
        data: {
            name,
            weight
        }
    });
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
    const { name, weight } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Category updated successfully",
        data: {
            name,
            weight
        }
    });
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
    res.json({
        success: true,
        code: 200,
        message: "Category deleted successfully"
    });
};
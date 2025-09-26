import { Request, Response } from "express";
import priceService from "./price.service";
import HttpError from "../common/exceptions/http.error";

// Get all prices
export const getAllPrices = async (req: Request, res: Response) => {
    const prices = await priceService.getAllPrices();

    if (!prices) throw new HttpError(404, "Prices not found");

    res.json({
        success: true,
        code: 200,
        message: "Prices fetched successfully",
        data: prices
    });
};

// Get price by ID
export const getPriceById = async (req: Request, res: Response) => {
    const price = await priceService.findPriceById(Number(req.params.id));

    if (!price) throw new HttpError(404, "Price not found");

    res.json({
        success: true,
        code: 200,
        message: "Price fetched successfully",
        data: price
    });
};

// Create a new price
export const createPrice = async (req: Request, res: Response) => {
    const { amount, category_id } = req.body;

    const newPrice = await priceService.createPrice(amount, category_id);

    if (!newPrice) throw new HttpError(500, "Failed to create price");

    res.json({
        success: true,
        code: 200,
        message: "Price created successfully",
        data: newPrice
    });
};

// Update a price
export const updatePrice = async (req: Request, res: Response) => {
    const { amount, category_id } = req.body;

    const updatedPrice = await priceService.updatePrice(Number(req.params.id), amount, category_id);

    if (!updatedPrice) throw new HttpError(500, "Failed to update price");

    res.json({
        success: true,
        code: 200,
        message: "Price updated successfully",
        data: updatedPrice
    });
};

// Delete a price
export const deletePrice = async (req: Request, res: Response) => {
    const deletedPrice = await priceService.deletePrice(Number(req.params.id));

    if (!deletedPrice) throw new HttpError(500, "Failed to delete price");

    res.json({
        success: true,
        code: 200,
        message: "Price deleted successfully"
    });
};
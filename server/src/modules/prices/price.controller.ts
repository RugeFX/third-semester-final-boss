import { Request, Response } from "express";
import priceService from "./price.service";
import HttpError from "../common/exceptions/http.error";
import { paramsSchema, createPriceSchema, updatePriceSchema } from "./price.schema";

// Get all prices
export const getAllPrices = async (_req: Request, res: Response) => {
    const prices = await priceService.getAllPrices();

    res.status(200).json({
        success: true,
        message: "Prices fetched successfully",
        data: prices
    });
};

// Get price by ID
export const getPriceById = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const price = await priceService.findPriceById(id);

    res.status(200).json({
        success: true,
        message: "Price fetched successfully",
        data: price
    });
};

// Create a new price
export const createPrice = async (req: Request, res: Response) => {
    const priceData = createPriceSchema.parse(req.body);

    const newPrice = await priceService.createPrice(priceData);

    if (!newPrice) throw new HttpError(500, "Failed to create price");

    res.status(201).json({
        success: true,
        message: "Price created successfully",
        data: newPrice
    });
};

// Update a price
export const updatePrice = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const priceData = updatePriceSchema.parse(req.body);

    const updatedPrice = await priceService.updatePrice(id, priceData);

    if (!updatedPrice) throw new HttpError(500, "Failed to update price");

    res.status(200).json({
        success: true,
        message: "Price updated successfully",
        data: updatedPrice
    });
};

// Delete a price
export const deletePrice = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const deletedPrice = await priceService.deletePrice(id);

    if (!deletedPrice) throw new HttpError(500, "Failed to delete price");

    res.status(200).json({
        success: true,
        message: "Price deleted successfully",
        data: deletedPrice
    });
};
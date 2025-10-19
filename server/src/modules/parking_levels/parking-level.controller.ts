import { Request, Response } from "express";
import parkingLevelService from "./parking-level.service";
import { paramsSchema, createParkingLevelSchema, updateParkingLevelSchema } from "./parking-level.schema";
import HttpError from "../common/exceptions/http.error";

// Get all parking levels
export const getAllParkingLevels = async (_req: Request, res: Response) => {
    const parkingLevels = await parkingLevelService.getAllParkingLevels();

    res.status(200).json({
        success: true,
        message: "Parking levels fetched successfully",
        data: parkingLevels
    });
};

// Get parking level by ID
export const getParkingLevelById = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const parkingLevel = await parkingLevelService.findParkingLevelById(id);

    res.status(200).json({
        success: true,
        message: "Parking level fetched successfully",
        data: parkingLevel
    });
};

// Create a new parking level
export const createParkingLevel = async (req: Request, res: Response) => {
    const parkingLevelData = createParkingLevelSchema.parse(req.body);

    const newParkingLevel = await parkingLevelService.createParkingLevel(parkingLevelData);

    if (!newParkingLevel) throw new HttpError(500, "Failed to create parking level");

    res.status(201).json({
        success: true,
        message: "Parking level created successfully",
        data: newParkingLevel
    });
};

// Update a parking level
export const updateParkingLevel = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const parkingLevelData = updateParkingLevelSchema.parse(req.body);

    const updatedParkingLevel = await parkingLevelService.updateParkingLevel(id, parkingLevelData);

    if (!updatedParkingLevel) throw new HttpError(500, "Failed to update parking level");

    res.status(200).json({
        success: true,
        message: "Parking level updated successfully",
        data: updatedParkingLevel
    });
};

// Delete a parking level
export const deleteParkingLevel = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const deletedParkingLevel = await parkingLevelService.deleteParkingLevel(id);

    if (!deletedParkingLevel) throw new HttpError(500, "Failed to delete parking level");

    res.status(200).json({
        success: true,
        message: "Parking level deleted successfully",
        data: deletedParkingLevel
    });
};
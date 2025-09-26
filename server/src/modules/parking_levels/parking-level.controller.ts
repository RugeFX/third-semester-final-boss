import { Request, Response } from "express";

// Get all parking levels
export const getAllParkingLevels = async (req: Request, res: Response) => {
    const parkingLevels = [
        {
            id: 1,
            name: "L1",
            max_weight: 20000
        },
        {
            id: 2,
            name: "L2",
            max_weight: 10000
        }
    ];

    res.json({
        success: true,
        code: 200,
        message: "Parking levels fetched successfully",
        data: parkingLevels
    });
};

// Get parking level by ID
export const getParkingLevelById = async (req: Request, res: Response) => {
    const parkingLevel = {
        id: 1,
        name: "L1",
        max_weight: 20000
    };

    res.json({
        success: true,
        code: 200,
        message: "Parking level fetched successfully",
        data: parkingLevel
    });
};

// Create a new parking level
export const createParkingLevel = async (req: Request, res: Response) => {
    const { name, max_weight } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Parking level created successfully",
        data: {
            name,
            max_weight
        }
    });
};

// Update a parking level
export const updateParkingLevel = async (req: Request, res: Response) => {
    const { name, max_weight } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Parking level updated successfully",
        data: {
            name,
            max_weight
        }
    });
};

// Delete a parking level
export const deleteParkingLevel = async (req: Request, res: Response) => {
    res.json({
        success: true,
        code: 200,
        message: "Parking level deleted successfully"
    });
};
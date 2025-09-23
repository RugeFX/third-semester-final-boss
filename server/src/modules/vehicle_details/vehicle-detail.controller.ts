import { Request, Response } from "express";

// Get all vehicle details
export const getAllVehicleDetails = async (req: Request, res: Response) => {
    const vehicleDetails = [
        {
            id: 1,
            plate_number: "B1234XYZ",
            category_id: 1,
            category: {
                id: 1,
                name: "Car",
                weight: 200
            }
        },
        {
            id: 2,
            plate_number: "C5678ABC",
            category_id: 2,
            category: {
                id: 2,
                name: "Motorcycle",
                weight: 100
            }
        }
    ];

    res.json({
        success: true,
        code: 200,
        message: "Vehicle details fetched successfully",
        data: vehicleDetails
    });
};

// Get vehicle detail by ID
export const getVehicleDetailById = async (req: Request, res: Response) => {
    const vehicleDetail = {
        id: 1,
        plate_number: "B1234XYZ",
        category_id: 1,
        category: {
            id: 1,
            name: "Car",
            weight: 200
        }
    };

    res.json({
        success: true,
        code: 200,
        message: "Vehicle detail fetched successfully",
        data: vehicleDetail
    });
};

// Create a vehicle detail
export const createVehicleDetail = async (req: Request, res: Response) => {
    const { plate_number, category_id } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Vehicle detail created successfully",
        data: {
            plate_number,
            category_id
        }
    });
};

// Update a vehicle detail
export const updateVehicleDetail = async (req: Request, res: Response) => {
    const { plate_number, category_id } = req.body;

    res.json({
        success: true,
        code: 200,
        message: "Vehicle detail updated successfully",
        data: {
            plate_number,
            category_id
        }
    });
};

// Delete a vehicle detail
export const deleteVehicleDetail = async (req: Request, res: Response) => {
    res.json({
        success: true,
        code: 200,
        message: "Vehicle detail deleted successfully"
    });
};
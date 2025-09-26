import { Request, Response } from "express";
import vehicleDetailService from "./vehicle-detail.service";

// Get all vehicle details
export const getAllVehicleDetails = async (req: Request, res: Response) => {
    // Dummy data
    // const vehicleDetails = [
    //     {
    //         id: 1,
    //         plate_number: "B1234XYZ",
    //         category_id: 1,
    //         category: {
    //             id: 1,
    //             name: "Car",
    //             weight: 200
    //         }
    //     },
    //     {
    //         id: 2,
    //         plate_number: "C5678ABC",
    //         category_id: 2,
    //         category: {
    //             id: 2,
    //             name: "Motorcycle",
    //             weight: 100
    //         }
    //     }
    // ];

    const vehicleDetails = await vehicleDetailService.getAllVehicleDetails();

    res.json({
        success: true,
        code: 200,
        message: "Vehicle details fetched successfully",
        data: vehicleDetails
    });
};

// Get vehicle detail by ID
export const getVehicleDetailById = async (req: Request, res: Response) => {
    // Dummy data 
    // const vehicleDetail = {
    //     id: 1,
    //     plate_number: "B1234XYZ",
    //     category_id: 1,
    //     category: {
    //         id: 1,
    //         name: "Car",
    //         weight: 200
    //     }
    // };

    const vehicleDetail = await vehicleDetailService.findVehicleDetailById(parseInt(req.params.id));

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

    await vehicleDetailService.createVehicleDetail(plate_number, category_id);

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

    await vehicleDetailService.updateVehicleDetail(parseInt(req.params.id), plate_number, category_id);

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
    await vehicleDetailService.deleteVehicleDetail(parseInt(req.params.id));

    res.json({
        success: true,
        code: 200,
        message: "Vehicle detail deleted successfully"
    });
};
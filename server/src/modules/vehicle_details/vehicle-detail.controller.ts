import { Request, Response } from "express";
import vehicleDetailService from "./vehicle-detail.service";
import { paramsSchema, createVehicleDetailSchema, updateVehicleDetailSchema } from "./vehicle-detail.schema";
import HttpError from "../common/exceptions/http.error";

// Get all vehicle details
export const getAllVehicleDetails = async (req: Request, res: Response) => {
    const vehicleDetails = await vehicleDetailService.getAllVehicleDetails();

    res.status(200).json({
        success: true,
        message: "Vehicle details fetched successfully",
        data: vehicleDetails
    });
};

// Get vehicle detail by ID
export const getVehicleDetailById = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const vehicleDetail = await vehicleDetailService.findVehicleDetailById(id);

    res.status(200).json({
        success: true,
        message: "Vehicle detail fetched successfully",
        data: vehicleDetail
    });
};

// Create a vehicle detail
export const createVehicleDetail = async (req: Request, res: Response) => {
    const { plateNumber, categoryId } = createVehicleDetailSchema.parse(req.body);

    const newVehicleDetail = await vehicleDetailService.createVehicleDetail(plateNumber, categoryId);

    if (!newVehicleDetail) throw new HttpError(500, "Failed to create vehicle detail");    

    res.status(201).json({
        success: true,
        message: "Vehicle detail created successfully",
        data: newVehicleDetail
    });
};

// Update a vehicle detail
export const updateVehicleDetail = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const { plateNumber, categoryId } = updateVehicleDetailSchema.parse(req.body);

    const updatedVehicleDetail = await vehicleDetailService.updateVehicleDetail(id, plateNumber, categoryId);

    if (!updatedVehicleDetail) throw new HttpError(500, "Failed to update vehicle detail");

    res.status(200).json({
        success: true,
        message: "Vehicle detail updated successfully",
        data: updatedVehicleDetail
    });
};

// Delete a vehicle detail
export const deleteVehicleDetail = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const deletedVehicleDetail = await vehicleDetailService.deleteVehicleDetail(id);

    if (!deletedVehicleDetail) throw new HttpError(500, "Failed to delete vehicle detail");

    res.status(200).json({
        success: true,
        message: "Vehicle detail deleted successfully"
    });
};
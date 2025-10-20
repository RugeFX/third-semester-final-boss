import { db } from "../../db";
import HttpError from "../../common/exceptions/http.error";
import vehicleDetailRepository from "./vehicle-detail.repository";
import { createVehicleDetailSchema, updateVehicleDetailSchema } from "./vehicle-detail.schema";
import categoryService from "../categories/category.service";
import { z } from "zod";

type TransactionDB = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

type createVehicleDetailInput = z.infer<typeof createVehicleDetailSchema>;
type updateVehicleDetailInput = z.infer<typeof updateVehicleDetailSchema>;

// Get all vehicle details
export const getAllVehicleDetails = async () => {
    return await vehicleDetailRepository.findAll();
};

// Find vehicle detail by ID
export const findVehicleDetailById = async (vehicleDetailId: number) => {
    const vehicleDetail = await vehicleDetailRepository.findById(vehicleDetailId);

    if (!vehicleDetail) throw new HttpError(404, "Vehicle detail not found");

    return vehicleDetail;
};

// Create a new vehicle detail
export const createVehicleDetail = async (vehicleDetailData: createVehicleDetailInput, tx?: TransactionDB) => {
    await categoryService.findCategoryById(vehicleDetailData.categoryId);

    return await vehicleDetailRepository.create(vehicleDetailData, tx);
};

// Update a vehicle detail
export const updateVehicleDetail = async (vehicleDetailId: number, vehicleDetailData: updateVehicleDetailInput) => {
    await findVehicleDetailById(vehicleDetailId);
    await categoryService.findCategoryById(vehicleDetailData.categoryId);

    return await vehicleDetailRepository.update(vehicleDetailId, vehicleDetailData);
};

// Delete a vehicle detail
export const deleteVehicleDetail = async (vehicleDetailId: number) => {
    await findVehicleDetailById(vehicleDetailId);

    return await vehicleDetailRepository.remove(vehicleDetailId);
};

export default { getAllVehicleDetails, findVehicleDetailById, createVehicleDetail, updateVehicleDetail, deleteVehicleDetail };
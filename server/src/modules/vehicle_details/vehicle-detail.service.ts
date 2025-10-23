import { db } from "../../db";
import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
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
export const updateVehicleDetail = async (vehicleDetailId: number, vehicleDetailData: updateVehicleDetailInput, adminUserId: number) => {
    const oldVehicleDetail = await findVehicleDetailById(vehicleDetailId);
    
    await categoryService.findCategoryById(vehicleDetailData.categoryId);

    const updatedVehicleDetail = await vehicleDetailRepository.update(vehicleDetailId, vehicleDetailData);

    // Create audit log for update
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated vehicle detail (ID: ${vehicleDetailId}). Old Data: ${JSON.stringify(oldVehicleDetail)}, New Data: ${JSON.stringify(updatedVehicleDetail)}`,
            type: "VEHICLE_DETAIL_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for vehicle detail update:", error);
    }

    return updatedVehicleDetail;
};

// Delete a vehicle detail
export const deleteVehicleDetail = async (vehicleDetailId: number, adminUserId: number) => {
    await findVehicleDetailById(vehicleDetailId);

    const deletedVehicleDetail = await vehicleDetailRepository.remove(vehicleDetailId);

    // Create audit log for deletion
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted vehicle detail (ID: ${vehicleDetailId}). Data: ${JSON.stringify(deletedVehicleDetail)}`,
            type: "VEHICLE_DETAIL_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for vehicle detail deletion:", error);
    }

    return deletedVehicleDetail;
};

export default { getAllVehicleDetails, findVehicleDetailById, createVehicleDetail, updateVehicleDetail, deleteVehicleDetail };
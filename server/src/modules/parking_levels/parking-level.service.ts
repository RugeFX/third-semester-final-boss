import parkingLevelRepository from "./parking-level.repository";
import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
import { z } from "zod";
import { createParkingLevelSchema, updateParkingLevelSchema } from "./parking-level.schema";

type createParkingLevelInput = z.infer<typeof createParkingLevelSchema>;
type updateParkingLevelInput = z.infer<typeof updateParkingLevelSchema>;

// Get all parking levels
export const getAllParkingLevels = async () => {
    return await parkingLevelRepository.findAll();
};

// Find parking level by ID
export const findParkingLevelById = async (parkingLevelId: number) => {
    const parkingLevel = await parkingLevelRepository.findById(parkingLevelId);

    if (!parkingLevel) throw new HttpError(404, "Parking level not found");

    return parkingLevel;
};

// Create a new parking level
export const createParkingLevel = async (parkingLevelData: createParkingLevelInput) => {
    return await parkingLevelRepository.create(parkingLevelData);
};

// Update a parking level
export const updateParkingLevel = async (
    parkingLevelId: number, 
    parkingLevelData: updateParkingLevelInput, 
    adminUserId: number
) => {
    const oldParkingLevel = await findParkingLevelById(parkingLevelId);

    const updatedParkingLevel = await parkingLevelRepository.update(parkingLevelId, parkingLevelData);

    // Create audit log for update
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated parking level (ID: ${parkingLevelId}). Old Data: ${JSON.stringify(oldParkingLevel)}, New Data: ${JSON.stringify(updatedParkingLevel)}`,
            type: "PARKING_LEVEL_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for parking level update:", error);
    }

    return updatedParkingLevel;
};

// Delete a parking level
export const deleteParkingLevel = async (parkingLevelId: number, adminUserId: number) => {
    await findParkingLevelById(parkingLevelId);

    const deletedParkingLevel = await parkingLevelRepository.remove(parkingLevelId);

    // Create audit log for deletion
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted parking level (ID: ${parkingLevelId}). Data: ${JSON.stringify(deletedParkingLevel)}`,
            type: "PARKING_LEVEL_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for parking level deletion:", error);
    }

    return deletedParkingLevel;
};

export default { getAllParkingLevels, findParkingLevelById, createParkingLevel, updateParkingLevel, deleteParkingLevel };
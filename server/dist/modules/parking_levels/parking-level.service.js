import parkingLevelRepository from "./parking-level.repository";
import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
export const getAllParkingLevels = async () => {
    return await parkingLevelRepository.findAll();
};
export const findParkingLevelById = async (parkingLevelId) => {
    const parkingLevel = await parkingLevelRepository.findById(parkingLevelId);
    if (!parkingLevel)
        throw new HttpError(404, "Parking level not found");
    return parkingLevel;
};
export const createParkingLevel = async (parkingLevelData) => {
    return await parkingLevelRepository.create(parkingLevelData);
};
export const updateParkingLevel = async (parkingLevelId, parkingLevelData, adminUserId) => {
    const oldParkingLevel = await findParkingLevelById(parkingLevelId);
    const updatedParkingLevel = await parkingLevelRepository.update(parkingLevelId, parkingLevelData);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated parking level (ID: ${parkingLevelId}). Old Data: ${JSON.stringify(oldParkingLevel)}, New Data: ${JSON.stringify(updatedParkingLevel)}`,
            type: "PARKING_LEVEL_UPDATE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for parking level update:", error);
    }
    return updatedParkingLevel;
};
export const deleteParkingLevel = async (parkingLevelId, adminUserId) => {
    await findParkingLevelById(parkingLevelId);
    const deletedParkingLevel = await parkingLevelRepository.remove(parkingLevelId);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted parking level (ID: ${parkingLevelId}). Data: ${JSON.stringify(deletedParkingLevel)}`,
            type: "PARKING_LEVEL_DELETE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for parking level deletion:", error);
    }
    return deletedParkingLevel;
};
export default { getAllParkingLevels, findParkingLevelById, createParkingLevel, updateParkingLevel, deleteParkingLevel };
//# sourceMappingURL=parking-level.service.js.map
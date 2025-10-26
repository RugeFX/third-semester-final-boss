import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
import vehicleDetailRepository from "./vehicle-detail.repository";
import categoryService from "../categories/category.service";
export const getAllVehicleDetails = async () => {
    return await vehicleDetailRepository.findAll();
};
export const findVehicleDetailById = async (vehicleDetailId) => {
    const vehicleDetail = await vehicleDetailRepository.findById(vehicleDetailId);
    if (!vehicleDetail)
        throw new HttpError(404, "Vehicle detail not found");
    return vehicleDetail;
};
export const createVehicleDetail = async (vehicleDetailData, tx) => {
    await categoryService.findCategoryById(vehicleDetailData.categoryId);
    return await vehicleDetailRepository.create(vehicleDetailData, tx);
};
export const updateVehicleDetail = async (vehicleDetailId, vehicleDetailData, adminUserId) => {
    const oldVehicleDetail = await findVehicleDetailById(vehicleDetailId);
    await categoryService.findCategoryById(vehicleDetailData.categoryId);
    const updatedVehicleDetail = await vehicleDetailRepository.update(vehicleDetailId, vehicleDetailData);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated vehicle detail (ID: ${vehicleDetailId}). Old Data: ${JSON.stringify(oldVehicleDetail)}, New Data: ${JSON.stringify(updatedVehicleDetail)}`,
            type: "VEHICLE_DETAIL_UPDATE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for vehicle detail update:", error);
    }
    return updatedVehicleDetail;
};
export const deleteVehicleDetail = async (vehicleDetailId, adminUserId) => {
    await findVehicleDetailById(vehicleDetailId);
    const deletedVehicleDetail = await vehicleDetailRepository.remove(vehicleDetailId);
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted vehicle detail (ID: ${vehicleDetailId}). Data: ${JSON.stringify(deletedVehicleDetail)}`,
            type: "VEHICLE_DETAIL_DELETE",
            createdBy: adminUserId
        });
    }
    catch (error) {
        console.error("Failed to create audit log for vehicle detail deletion:", error);
    }
    return deletedVehicleDetail;
};
export default { getAllVehicleDetails, findVehicleDetailById, createVehicleDetail, updateVehicleDetail, deleteVehicleDetail };
//# sourceMappingURL=vehicle-detail.service.js.map
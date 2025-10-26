import vehicleDetailService from "./vehicle-detail.service";
import { paramsSchema, createVehicleDetailSchema, updateVehicleDetailSchema } from "./vehicle-detail.schema";
import HttpError from "../../common/exceptions/http.error";
export const getAllVehicleDetails = async (_req, res) => {
    const vehicleDetails = await vehicleDetailService.getAllVehicleDetails();
    res.status(200).json({
        success: true,
        message: "Vehicle details fetched successfully",
        data: vehicleDetails
    });
};
export const getVehicleDetailById = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const vehicleDetail = await vehicleDetailService.findVehicleDetailById(id);
    res.status(200).json({
        success: true,
        message: "Vehicle detail fetched successfully",
        data: vehicleDetail
    });
};
export const createVehicleDetail = async (req, res) => {
    const vehicleDetailData = createVehicleDetailSchema.parse(req.body);
    const newVehicleDetail = await vehicleDetailService.createVehicleDetail(vehicleDetailData);
    if (!newVehicleDetail)
        throw new HttpError(500, "Failed to create vehicle detail");
    res.status(201).json({
        success: true,
        message: "Vehicle detail created successfully",
        data: newVehicleDetail
    });
};
export const updateVehicleDetail = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const vehicleDetailData = updateVehicleDetailSchema.parse(req.body);
    const updatedVehicleDetail = await vehicleDetailService.updateVehicleDetail(id, vehicleDetailData);
    if (!updatedVehicleDetail)
        throw new HttpError(500, "Failed to update vehicle detail");
    res.status(200).json({
        success: true,
        message: "Vehicle detail updated successfully",
        data: updatedVehicleDetail
    });
};
export const deleteVehicleDetail = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const deletedVehicleDetail = await vehicleDetailService.deleteVehicleDetail(id);
    if (!deletedVehicleDetail)
        throw new HttpError(500, "Failed to delete vehicle detail");
    res.status(200).json({
        success: true,
        message: "Vehicle detail deleted successfully",
        data: deletedVehicleDetail
    });
};
//# sourceMappingURL=vehicle-detail.controller.js.map
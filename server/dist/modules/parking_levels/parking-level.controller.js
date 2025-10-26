import parkingLevelService from "./parking-level.service";
import { paramsSchema, createParkingLevelSchema, updateParkingLevelSchema } from "./parking-level.schema";
import HttpError from "../../common/exceptions/http.error";
export const getAllParkingLevels = async (_req, res) => {
    const parkingLevels = await parkingLevelService.getAllParkingLevels();
    res.status(200).json({
        success: true,
        message: "Parking levels fetched successfully",
        data: parkingLevels
    });
};
export const getParkingLevelById = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const parkingLevel = await parkingLevelService.findParkingLevelById(id);
    res.status(200).json({
        success: true,
        message: "Parking level fetched successfully",
        data: parkingLevel
    });
};
export const createParkingLevel = async (req, res) => {
    const parkingLevelData = createParkingLevelSchema.parse(req.body);
    const newParkingLevel = await parkingLevelService.createParkingLevel(parkingLevelData);
    if (!newParkingLevel)
        throw new HttpError(500, "Failed to create parking level");
    res.status(201).json({
        success: true,
        message: "Parking level created successfully",
        data: newParkingLevel
    });
};
export const updateParkingLevel = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const parkingLevelData = updateParkingLevelSchema.parse(req.body);
    const adminUserId = req.user.id;
    const updatedParkingLevel = await parkingLevelService.updateParkingLevel(id, parkingLevelData, adminUserId);
    if (!updatedParkingLevel)
        throw new HttpError(500, "Failed to update parking level");
    res.status(200).json({
        success: true,
        message: "Parking level updated successfully",
        data: updatedParkingLevel
    });
};
export const deleteParkingLevel = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const adminUserId = req.user.id;
    const deletedParkingLevel = await parkingLevelService.deleteParkingLevel(id, adminUserId);
    if (!deletedParkingLevel)
        throw new HttpError(500, "Failed to delete parking level");
    res.status(200).json({
        success: true,
        message: "Parking level deleted successfully",
        data: deletedParkingLevel
    });
};
//# sourceMappingURL=parking-level.controller.js.map
import parkingLevelRepository from "./parking-level.repository";
import HttpError from "../../common/exceptions/http.error";
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
export const updateParkingLevel = async (parkingLevelId: number, parkingLevelData: updateParkingLevelInput) => {
    await findParkingLevelById(parkingLevelId);

    return await parkingLevelRepository.update(parkingLevelId, parkingLevelData);
};

// Delete a parking level
export const deleteParkingLevel = async (parkingLevelId: number) => {
    await findParkingLevelById(parkingLevelId);

    return await parkingLevelRepository.remove(parkingLevelId);
};

export default { getAllParkingLevels, findParkingLevelById, createParkingLevel, updateParkingLevel, deleteParkingLevel };
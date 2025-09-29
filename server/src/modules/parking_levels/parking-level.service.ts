import { db } from "../../db";
import { eq } from "drizzle-orm";
import { parkingLevelsTable } from "../../db/schema";
import HttpError from "../common/exceptions/http.error";

// Get all parking levels
export const getAllParkingLevels = async () => {
    const parkingLevels = await db.query.parkingLevelsTable.findMany();

    return parkingLevels;
};

// Find parking level by ID
export const findParkingLevelById = async (parkingLevelId: number) => {
    const parkingLevel = await db.query.parkingLevelsTable.findFirst({
        where: eq(parkingLevelsTable.id, parkingLevelId)
    });

    if (!parkingLevel) throw new HttpError(404, "Parking level not found");

    return parkingLevel;
};

// Create a new parking level
export const createParkingLevel = async (name: string, max_weight: number) => {
    const [ newParkingLevel ]  = await db.insert(parkingLevelsTable).values({ 
        name, 
        max_weight: max_weight.toString() 
    }).returning();
    
    return newParkingLevel;
};

// Update a parking level
export const updateParkingLevel = async (parkingLevelId: number, name: string, max_weight: number) => {
    await findParkingLevelById(parkingLevelId);

    const [ updatedParkingLevel ] = await db.update(parkingLevelsTable).set({ 
        name, 
        max_weight: max_weight.toString()
    }).where(eq(parkingLevelsTable.id, parkingLevelId)).returning();

    return updatedParkingLevel;
};

// Delete a parking level
export const deleteParkingLevel = async (parkingLevelId: number) => {
    await findParkingLevelById(parkingLevelId);

    const deletedParkingLevel = await db.delete(parkingLevelsTable).where(eq(parkingLevelsTable.id, parkingLevelId));

    return deletedParkingLevel;
};

export default { getAllParkingLevels, findParkingLevelById, createParkingLevel, updateParkingLevel, deleteParkingLevel };
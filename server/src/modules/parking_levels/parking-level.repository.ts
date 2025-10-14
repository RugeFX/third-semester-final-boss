import { db } from "../../db";
import { eq } from "drizzle-orm";
import { parkingLevelsTable } from "../../db/schema";
import { createParkingLevelSchema, updateParkingLevelSchema } from "./parking-level.schema";
import { z } from "zod";

type newParkingLevel = z.infer<typeof createParkingLevelSchema>;
type updatedParkingLevel = z.infer<typeof updateParkingLevelSchema>;

// Get all parking levels
export const findAll = async () => {
    return await db.query.parkingLevelsTable.findMany();
}

// Find parking level by ID
export const findById = async (parkingLevelId: number) => {
    return await db.query.parkingLevelsTable.findFirst({
        where: eq(parkingLevelsTable.id, parkingLevelId)
    });
}

// Create a parking level
export const create = async (parkingLevelData: newParkingLevel) => {
    const [ newParkingLevel ] = await db.insert(parkingLevelsTable).values({
        name: parkingLevelData.name,
        max_weight: parkingLevelData.maxWeight.toString()
    }).returning();

    return newParkingLevel;
}

// Update a parking level
export const update = async (parkingLevelId: number, parkingLevelData: updatedParkingLevel) => {
    const [ updatedParkingLevel ] = await db.update(parkingLevelsTable).set({
        name: parkingLevelData.name,
        max_weight: parkingLevelData.maxWeight.toString()
    }).where(eq(parkingLevelsTable.id, parkingLevelId)).returning();

    return updatedParkingLevel;
}

// Delete a parking level
export const remove = async (parkingLevelId: number) => {
    return await db.delete(parkingLevelsTable).where(eq(parkingLevelsTable.id, parkingLevelId));
}

export default { findAll, findById, create, update, remove };
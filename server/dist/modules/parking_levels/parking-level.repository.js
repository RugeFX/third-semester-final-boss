import { db } from "../../db";
import { eq } from "drizzle-orm";
import { parkingLevelsTable } from "../../db/schema";
export const findAll = async () => {
    return await db.query.parkingLevelsTable.findMany();
};
export const findById = async (parkingLevelId) => {
    return await db.query.parkingLevelsTable.findFirst({
        where: eq(parkingLevelsTable.id, parkingLevelId)
    });
};
export const create = async (parkingLevelData) => {
    const [newParkingLevel] = await db.insert(parkingLevelsTable).values({
        name: parkingLevelData.name,
        max_weight: parkingLevelData.maxWeight.toString()
    }).returning();
    return newParkingLevel;
};
export const update = async (parkingLevelId, parkingLevelData) => {
    const [updatedParkingLevel] = await db.update(parkingLevelsTable).set({
        name: parkingLevelData.name,
        max_weight: parkingLevelData.maxWeight.toString()
    }).where(eq(parkingLevelsTable.id, parkingLevelId)).returning();
    return updatedParkingLevel;
};
export const remove = async (parkingLevelId) => {
    const [deletedParkingLevel] = await db.delete(parkingLevelsTable).where(eq(parkingLevelsTable.id, parkingLevelId)).returning();
    return deletedParkingLevel;
};
export default { findAll, findById, create, update, remove };
//# sourceMappingURL=parking-level.repository.js.map
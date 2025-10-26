import { db } from "../../db";
import { eq } from "drizzle-orm";
import { vehicleDetailsTable } from "../../db/schema";
export const findAll = async () => {
    return await db.query.vehicleDetailsTable.findMany({
        with: {
            category: true
        }
    });
};
export const findById = async (vehicleDetailId) => {
    return await db.query.vehicleDetailsTable.findFirst({
        where: eq(vehicleDetailsTable.id, vehicleDetailId),
        with: {
            category: true
        }
    });
};
export const create = async (vehicleDetailData, tx = db) => {
    const [newVehicleDetail] = await tx.insert(vehicleDetailsTable).values({
        plate_number: vehicleDetailData.plateNumber,
        category_id: vehicleDetailData.categoryId
    }).returning();
    return newVehicleDetail;
};
export const update = async (vehicleDetailId, vehicleDetailData) => {
    const [updatedVehicleDetail] = await db.update(vehicleDetailsTable).set({
        plate_number: vehicleDetailData.plateNumber,
        category_id: vehicleDetailData.categoryId
    }).where(eq(vehicleDetailsTable.id, vehicleDetailId)).returning();
    return updatedVehicleDetail;
};
export const remove = async (vehicleDetailId) => {
    const [deletedVehicleDetail] = await db.delete(vehicleDetailsTable).where(eq(vehicleDetailsTable.id, vehicleDetailId)).returning();
    return deletedVehicleDetail;
};
export default { findAll, findById, create, update, remove };
//# sourceMappingURL=vehicle-detail.repository.js.map
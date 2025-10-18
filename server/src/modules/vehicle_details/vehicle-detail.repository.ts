import { db } from "../../db";
import { eq } from "drizzle-orm";
import { vehicleDetailsTable } from "../../db/schema";
import { createVehicleDetailSchema, updateVehicleDetailSchema } from "./vehicle-detail.schema";
import { z } from "zod";

type TransactionDB = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

type newVehicleDetail = z.infer<typeof createVehicleDetailSchema>;
type updatedVehicleDetail = z.infer<typeof updateVehicleDetailSchema>;

// Get all vehicle details
export const findAll = async () => {
    return await db.query.vehicleDetailsTable.findMany({
        with: {
            category: true
        }
    });
}

// Find vehicle detail by ID
export const findById = async (vehicleDetailId: number) => {
    return await db.query.vehicleDetailsTable.findFirst({
        where: eq(vehicleDetailsTable.id, vehicleDetailId),
        with: {
            category: true
        }
    });
}

// Create a vehicle detail
export const create = async (vehicleDetailData: newVehicleDetail, tx: TransactionDB = db) => {
    const [ newVehicleDetail ] = await tx.insert(vehicleDetailsTable).values({
        plate_number: vehicleDetailData.plateNumber,
        category_id: vehicleDetailData.categoryId
    }).returning();

    return newVehicleDetail;
}

// Update a vehicle detail
export const update = async (vehicleDetailId: number, vehicleDetailData: updatedVehicleDetail) => {
    const [ updatedVehicleDetail ] = await db.update(vehicleDetailsTable).set({
        plate_number: vehicleDetailData.plateNumber,
        category_id: vehicleDetailData.categoryId
    }).where(eq(vehicleDetailsTable.id, vehicleDetailId)).returning();

    return updatedVehicleDetail;
}

// Delete a vehicle detail
export const remove = async (vehicleDetailId: number) => {
    return await db.delete(vehicleDetailsTable).where(
        eq(vehicleDetailsTable.id, vehicleDetailId)
    ).returning();
}

export default { findAll, findById, create, update, remove };
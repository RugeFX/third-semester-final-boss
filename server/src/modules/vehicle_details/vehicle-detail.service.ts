import { db } from "../../db";
import HttpError from "../common/exceptions/http.error";
import { eq } from "drizzle-orm";
import { vehiclesDetailsTable } from "../../db/schema";
import categoryService from "../categories/category.service";

// Get all vehicle details
export const getAllVehicleDetails = async () => {
    const vehicleDetails = await db.query.vehiclesDetailsTable.findMany({
        with: {
            category: true
        }
    });

    if (!vehicleDetails) throw new HttpError(404, "Vehicle details not found");

    return vehicleDetails;
};

// Find vehicle detail by ID
export const findVehicleDetailById = async (vehicleDetailId: number) => {
    const vehicleDetail = await db.query.vehiclesDetailsTable.findFirst({
        where: eq(vehiclesDetailsTable.id, vehicleDetailId),
        with: {
            category: true
        }
    });

    if (!vehicleDetail) throw new HttpError(400, "Vehicle detail not found");

    return vehicleDetail;
};

// Create a new vehicle detail
export const createVehicleDetail = async (plate_number: string, category_id: number) => {
    const checkCategory = await categoryService.findCategoryById(category_id);

    if (!checkCategory) throw new HttpError(400, "Category not found");

    const newVehicleDetail = await db.insert(vehiclesDetailsTable).values({
        plate_number,
        category_id
    });

    if (!newVehicleDetail) throw new HttpError(500, "Failed to create vehicle detail");

    return newVehicleDetail;
};

// Update a vehicle detail
export const updateVehicleDetail = async (vehicleDetailId: number, plate_number: string, category_id: number) => {
    const checkCategory = await categoryService.findCategoryById(category_id);

    if (!checkCategory) throw new HttpError(400, "Category not found");

    const updatedVehicleDetail = await db.update(vehiclesDetailsTable).set({
        plate_number,
        category_id
    }).where(eq(vehiclesDetailsTable.id, vehicleDetailId));

    if (!updatedVehicleDetail) throw new HttpError(500, "Failed to update vehicle detail");

    return updatedVehicleDetail;
};

// Delete a vehicle detail
export const deleteVehicleDetail = async (vehicleDetailId: number) => {
    const vehicleDetail = await findVehicleDetailById(vehicleDetailId);

    if (!vehicleDetail) throw new HttpError(404, "Vehicle detail not found");

    await db.delete(vehiclesDetailsTable).where(eq(vehiclesDetailsTable.id, vehicleDetailId));
};

export default { getAllVehicleDetails, findVehicleDetailById, createVehicleDetail, updateVehicleDetail, deleteVehicleDetail };
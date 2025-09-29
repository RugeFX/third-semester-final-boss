import { db } from "../../db";
import HttpError from "../common/exceptions/http.error";
import { eq } from "drizzle-orm";
import { vehicleDetailsTable } from "../../db/schema";
import categoryService from "../categories/category.service";

// Get all vehicle details
export const getAllVehicleDetails = async () => {
    const vehicleDetails = await db.query.vehicleDetailsTable.findMany({
        with: {
            category: true
        }
    });

    return vehicleDetails;
};

// Find vehicle detail by ID
export const findVehicleDetailById = async (vehicleDetailId: number) => {
    const vehicleDetail = await db.query.vehicleDetailsTable.findFirst({
        where: eq(vehicleDetailsTable.id, vehicleDetailId),
        with: {
            category: true
        }
    });

    if (!vehicleDetail) throw new HttpError(404, "Vehicle detail not found");

    return vehicleDetail;
};

// Find vehicle detail by plate number
// export const findVehicleDetailByPlateNumber = async (plate_number: string) => {
//     const vehicleDetail = await db.query.vehicleDetailsTable.findFirst({
//         where: eq(vehicleDetailsTable.plate_number, plate_number),
//         with: {
//             category: true
//         }
//     });

//     if (!vehicleDetail) throw new HttpError(404, "Vehicle detail not found");

//     return vehicleDetail;
// };

// Create a new vehicle detail
export const createVehicleDetail = async (plate_number: string, category_id: number) => {
    await categoryService.findCategoryById(category_id);

    const [ newVehicleDetail ] = await db.insert(vehicleDetailsTable).values({
        plate_number,
        category_id
    }).returning();

    return newVehicleDetail ;
};

// Update a vehicle detail
export const updateVehicleDetail = async (vehicleDetailId: number, plate_number: string, category_id: number) => {
    await findVehicleDetailById(vehicleDetailId);
    await categoryService.findCategoryById(category_id);

    const [ updatedVehicleDetail ] = await db.update(vehicleDetailsTable).set({
        plate_number,
        category_id
    }).where(eq(vehicleDetailsTable.id, vehicleDetailId)).returning();

    return updatedVehicleDetail;
};

// Delete a vehicle detail
export const deleteVehicleDetail = async (vehicleDetailId: number) => {
    await findVehicleDetailById(vehicleDetailId);

    const deletedVehicleDetail = await db.delete(vehicleDetailsTable).where(eq(vehicleDetailsTable.id, vehicleDetailId));

    return deletedVehicleDetail;
};

export default { getAllVehicleDetails, findVehicleDetailById, createVehicleDetail, updateVehicleDetail, deleteVehicleDetail };
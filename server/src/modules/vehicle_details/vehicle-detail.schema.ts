import { z } from "zod";

export const paramsSchema = z.object({ 
    id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const createVehicleDetailSchema = z.object({
    plate_number: z.string().min(3, "Plate number must be at least 3 characters long"),
    category_id: z.coerce.number().int().positive("Category ID must be a positive number"),
});

export const updateVehicleDetailSchema = createVehicleDetailSchema.clone();
import { z } from "zod";

export const paramsSchema = z.object({ 
    accessCode: z.string().min(3, "Access code must be at least 3 characters long"),
});

export const entryTransactionSchema = z.object({
    userId: z.coerce.number().int().positive("User ID must be a positive number"),
    categoryId: z.coerce.number().int().positive("Category ID must be a positive number"),
    parkingLevelId: z.coerce.number().int().positive("Parking level ID must be a positive number"),
    plateNumber: z.string().min(3, "Plate number must be at least 3 characters long"),
});
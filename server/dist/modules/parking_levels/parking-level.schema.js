import { z } from "zod";
export const paramsSchema = z.object({
    id: z.coerce.number().int().positive("ID must be a positive number"),
});
export const createParkingLevelSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    maxWeight: z.number().positive("Max weight must be a positive number"),
});
export const updateParkingLevelSchema = createParkingLevelSchema.clone();
//# sourceMappingURL=parking-level.schema.js.map
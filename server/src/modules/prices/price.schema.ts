import { z } from "zod";

export const paramsSchema = z.object({ 
    id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const createPriceSchema = z.object({
    amount: z.number().positive("Amount must be a positive number"),
    categoryId: z.coerce.number().int().positive("Category ID must be a positive number"),
});

export const updatePriceSchema = createPriceSchema.clone();
import { z } from "zod";
export const paramsSchema = z.object({
    id: z.coerce.number().int().positive("ID must be a positive number"),
});
export const categoryPriceParamsSchema = z.object({
    categoryId: z.coerce.number().int().positive("Category ID must be a positive number"),
});
export const createPriceSchema = z.object({
    amount: z.number().positive("Amount must be a positive number"),
    categoryId: z.coerce.number().int().positive("Category ID must be a positive number"),
    type: z.string().min(3, "Type must be at least 3 characters long"),
    blockHours: z.coerce.number().int().positive("Block hours must be a positive number").nullable().optional(),
    isActive: z.boolean().default(true),
    validFrom: z.coerce.date().nullable().optional(),
    validUntil: z.coerce.date().nullable().optional(),
});
export const updatePriceSchema = createPriceSchema.clone();
//# sourceMappingURL=price.schema.js.map
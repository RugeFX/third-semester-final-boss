import { z } from 'zod';

export const paramsSchema = z.object({ 
    id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const createCategorySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    weight: z.number().positive("Weight must be a positive number"),
    icon: z.string().min(3, "Icon must be at least 3 characters long"),
    thumbnail: z.string().min(3, "Thumbnail must be at least 3 characters long"),
});

export const updateCategorySchema = createCategorySchema.clone();
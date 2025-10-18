import { z } from 'zod';

export const paramsSchema = z.object({ 
    id: z.coerce.number().int().positive("ID must be a positive number"),
});
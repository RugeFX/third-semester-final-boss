import { z } from 'zod';

export const paramsSchema = z.object({ 
    id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const createAuditLogSchema = z.object({
    context: z.string().min(1, "Context is required"),
    type: z.string().min(1, "Type is required"),
    createdBy: z.number().int().positive("CreatedBy must be a positive number"),
});
import { z } from "zod";

export const paramsSchema = z.object({ 
    id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const createMemberSchema = z.object({
    endedAt: z.coerce.date().min(new Date(), "End date must be in the future"),
    userId: z.coerce.number().int().positive("User ID must be a positive number"),
});

export const updateMemberSchema = createMemberSchema.pick({ endedAt: true });
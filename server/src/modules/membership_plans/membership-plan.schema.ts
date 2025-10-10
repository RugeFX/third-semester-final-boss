import { z } from "zod";

export const paramsSchema = z.object({ 
    id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const createMembershipPlanSchema = z.object({
    cost: z.number().positive("Cost must be a positive number"),
    period: z.coerce.number().int().positive("Period must be a positive number"),
});

export const updateMembershipPlanSchema = createMembershipPlanSchema.clone();
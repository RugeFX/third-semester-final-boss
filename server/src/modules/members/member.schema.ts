import { z } from "zod";

export const paramsSchema = z.object({ 
    id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const createMemberSchema = z.object({
    endedAt: z.coerce.date().refine((date) => date.getTime() > Date.now(), "End date must be in the future"),
    userId: z.coerce.number().int().positive("User ID must be a positive number"),
});

export const updateMemberSchema = createMemberSchema.pick({ endedAt: true });

export const renewMembershipSchema = z.object({
    renewalPeriodMonths: z.coerce.number().int().positive("Renewal period must be a positive number"),
    amountPaid: z.coerce.number().positive("Amount paid must be a positive number"),
});
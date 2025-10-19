import { z } from "zod";

export const paramsSchema = z.object({ 
    accessCode: z.string().min(3, "Access code must be at least 3 characters long"),
});

export const createTransactionSchema = z.object({
    status: z.enum(["ENTRY", "EXIT"]).default("ENTRY"),
    paidAmount: z.coerce.number().positive("Paid amount must be a positive number").nullable().optional(),
    accessCode: z.string().min(3, "Access code must be at least 3 characters long"),
    userId: z.coerce.number().int().positive("User ID must be a positive number").nullable().optional(),
    vehicleDetailId: z.coerce.number().int().positive("Vehicle detail ID must be a positive number"),
    parkingLevelId: z.coerce.number().int().positive("Parking level ID must be a positive number"),
});

export const updateTransactionSchema = createTransactionSchema.pick({
    status: true,
    paidAmount: true,
});

export const processPaymentSchema = z.object({
    paidAmount: z.coerce.number().positive("Paid amount must be a positive number"),
});

export const entryTransactionSchema = z.object({
    userId: z.coerce.number().int().positive("User ID must be a positive number").nullable().optional(),
    categoryId: z.coerce.number().int().positive("Category ID must be a positive number"),
    parkingLevelId: z.coerce.number().int().positive("Parking level ID must be a positive number"),
    plateNumber: z.string().min(3, "Plate number must be at least 3 characters long"),
});
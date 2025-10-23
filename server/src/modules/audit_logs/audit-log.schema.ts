import { z } from 'zod';

export const paramsSchema = z.object({
    id: z.coerce.number().int().positive("ID must be a positive number"),
});

export const auditLogTypeEnum = z.enum([
    "USER_UPDATE",
    "USER_DELETE",
    "PRICE_UPDATE",
    "PRICE_DELETE",
    "CATEGORY_UPDATE",
    "CATEGORY_DELETE",
    "MEMBER_UPDATE",
    "MEMBER_DELETE",
    "MEMBERSHIP_PLAN_UPDATE",
    "MEMBERSHIP_PLAN_DELETE",
    "PARKING_LEVEL_UPDATE",
    "PARKING_LEVEL_DELETE",
    "VEHICLE_DETAIL_UPDATE",
    "VEHICLE_DETAIL_DELETE",
    "TRANSACTION_UPDATE",
    "TRANSACTION_DELETE"
]);

export const createAuditLogSchema = z.object({
    context: z.string().min(1, "Context is required").max(10000, "Context too large"),
    type: auditLogTypeEnum,
    createdBy: z.number().int().positive("CreatedBy must be a positive number"),
});
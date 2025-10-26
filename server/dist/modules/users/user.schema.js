import { z } from "zod";
export const paramsSchema = z.object({
    id: z.coerce.number().int().positive("ID must be a positive number"),
});
export const createUserSchema = z.object({
    fullname: z.string().min(3, "Full name must be at least 3 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(3, "Password must be at least 3 characters long"),
    role: z.enum(["admin", "member"]).default("member"),
});
export const updateUserSchema = createUserSchema.pick({ fullname: true, username: true, role: true });
export const resetPasswordSchema = z.object({
    newPassword: z.string().min(3, "Password must be at least 3 characters long"),
});
export const changeUserPasswordSchema = z.object({
    currentPassword: z.string().min(3, "Password must be at least 3 characters long"),
    newPassword: z.string().min(3, "Password must be at least 3 characters long"),
});
//# sourceMappingURL=user.schema.js.map
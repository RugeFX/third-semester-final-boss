import { z } from "zod";

export const paramsSchema = z.object({ 
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(3, "Password must be at least 3 characters long"),
});

export const registerUserSchema = z.object({
    fullname: z.string().min(3, "Full name must be at least 3 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
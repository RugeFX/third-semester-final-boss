import { db } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/schema";
import { createUserSchema, updateUserSchema } from "./user.schema";
import { z } from "zod";

type newUser = z.infer<typeof createUserSchema>;
type updatedUser = z.infer<typeof updateUserSchema>;

// Get all users
export const findAll = async () => {
    return await db.query.usersTable.findMany();
}

// Find user by ID
export const findById = async (userId: number) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId)
    });
}

// Create a user
export const create = async (userData: newUser) => {
    const [ newUser ] = await db.insert(usersTable).values(userData).returning();

    return newUser;
}

// Update a user
export const update = async (userId: number, userData: updatedUser) => {
    const [ updatedUser ] = await db.update(usersTable).set(userData).where(eq(usersTable.id, userId)).returning();

    return updatedUser;
}

// Delete a user
export const remove = async (userId: number) => {
    return await db.delete(usersTable).where(eq(usersTable.id, userId)).returning();
}

export default { findAll, findById, create, update, remove };
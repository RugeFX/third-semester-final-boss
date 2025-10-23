import { db } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/schema";
import { createUserSchema, updateUserSchema } from "./user.schema";
import { z } from "zod";

type newUser = z.infer<typeof createUserSchema>;
type updatedUser = z.infer<typeof updateUserSchema>;

// Get all users
export const findAll = async () => {
    return await db.query.usersTable.findMany({
        // Exclude password field
        columns: {
            id: true,
            fullname: true,
            username: true,
            role: true
        }
    });
}

// Find user by ID
export const findById = async (userId: number) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
        // Exclude password field
        columns: {
            id: true,
            fullname: true,
            username: true,
            role: true
        }
    });
}

// Create a user
export const create = async (userData: newUser) => {
    const [ newUser ] = await db.insert(usersTable).values(userData).returning({
        // Exclude password field
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role
    });

    return newUser;
}

// Update a user
export const update = async (userId: number, userData: updatedUser) => {
    const [ updatedUser ] = await db.update(usersTable).set(userData).where(eq(usersTable.id, userId)).returning({
        // Exclude password field
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role
    });

    return updatedUser;
}

// Delete a user
export const remove = async (userId: number) => {
    const [ deletedUser ] = await db.delete(usersTable).where(
        eq(usersTable.id, userId)
    ).returning({
        // Exclude password field
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role
    });

    return deletedUser;
}

// Update user password
export const updateUserPassword = async (userId: number, hashedPassword: string) => {
    const [ updatedUser ] = await db.update(usersTable).set({ 
        password: hashedPassword }
    ).where(eq(usersTable.id, userId)).returning({
        // Exclude password field
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role
    });

    return updatedUser;
};

export default { findAll, findById, create, update, remove, updateUserPassword };
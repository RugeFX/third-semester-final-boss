import { db } from "../../db";
import HttpError from "../common/exceptions/http.error";
import { eq } from "drizzle-orm";
import { Role, usersTable } from "../../db/schema";

// Get all users
export const getAllUsers = async () => {
    const users = await db.query.usersTable.findMany();

    return users;
};

// Find user by ID
export const findUserById = async (userId: number) => {
    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
    });

    if (!user) throw new HttpError(404, "User not found");

    return user;
};

// Create a new user
export const createUser = async (fullname: string, username: string, password: string, role: Role) => {
    const [newUser] = await db.insert(usersTable).values({
        fullname, username, password, role
    }).returning();

    return newUser;
};

// Update a user
export const updateUser = async (userId: number, fullname: string, username: string, role: Role) => {
    await findUserById(userId);

    const [updatedUser] = await db.update(usersTable).set({
        fullname, username, role
    }).where(eq(usersTable.id, userId)).returning();

    return updatedUser;
};

// Delete a user
export const deleteUser = async (userId: number) => {
    await findUserById(userId);

    const deletedUser = await db.delete(usersTable).where(eq(usersTable.id, userId));

    return deletedUser;
};

export default { getAllUsers, findUserById, createUser, updateUser, deleteUser };
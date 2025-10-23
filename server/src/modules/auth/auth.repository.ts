import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { usersTable } from '../../db/schema';
import { registerUserSchema } from './auth.schema';
import { z } from 'zod';

export type registerNewUser = z.infer<typeof registerUserSchema>;

// Find user by user id
export const findUserById = async (userId: number) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
    });
};

// Find user by username
export const findUserByUsername = async (username: string) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.username, username),
    });
};

// Register new user
export const registerUser = async (userData: registerNewUser) => {
    const [ newUser ] = await db.insert(usersTable).values({
        fullname: userData.fullname,
        username: userData.username,
        password: userData.password,
        role: 'member',
    }).returning({
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role,
    });

    return newUser;
};

export default { findUserByUsername, registerUser, findUserById };
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/schema";
export const findAll = async () => {
    return await db.query.usersTable.findMany({
        columns: {
            id: true,
            fullname: true,
            username: true,
            role: true
        }
    });
};
export const findById = async (userId) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
        columns: {
            id: true,
            fullname: true,
            username: true,
            role: true
        }
    });
};
export const create = async (userData) => {
    const [newUser] = await db.insert(usersTable).values(userData).returning({
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role
    });
    return newUser;
};
export const update = async (userId, userData) => {
    const [updatedUser] = await db.update(usersTable).set(userData).where(eq(usersTable.id, userId)).returning({
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role
    });
    return updatedUser;
};
export const remove = async (userId) => {
    const [deletedUser] = await db.delete(usersTable).where(eq(usersTable.id, userId)).returning({
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role
    });
    return deletedUser;
};
export const updateUserPassword = async (userId, hashedPassword) => {
    const [updatedUser] = await db.update(usersTable).set({
        password: hashedPassword
    }).where(eq(usersTable.id, userId)).returning({
        id: usersTable.id,
        fullname: usersTable.fullname,
        username: usersTable.username,
        role: usersTable.role
    });
    return updatedUser;
};
export default { findAll, findById, create, update, remove, updateUserPassword };
//# sourceMappingURL=user.repository.js.map
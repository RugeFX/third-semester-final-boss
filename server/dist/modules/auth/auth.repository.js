import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { usersTable } from '../../db/schema';
export const findUserById = async (userId) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
    });
};
export const findUserByUsername = async (username) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.username, username),
    });
};
export const registerUser = async (userData) => {
    const [newUser] = await db.insert(usersTable).values({
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
//# sourceMappingURL=auth.repository.js.map
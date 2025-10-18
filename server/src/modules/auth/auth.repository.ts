import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { usersTable } from '../../db/schema';

// Find user by username
export const findUserByUsername = async (username: string) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.username, username),
    });
};

export default { findUserByUsername };
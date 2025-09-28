import { db } from "../../db";
import HttpError from "../common/exceptions/http.error";
import { eq } from "drizzle-orm";
import { usersTable } from "../../db/schema";

export const authenticateUser = async (username: string, password: string) => {
    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.username, username)
    });

    if (!user) throw new HttpError(401, "Invalid email or password");

    if (user.password !== password) throw new HttpError(401, "Invalid name or password");

    const token = "token";

    return token;
};

export default { authenticateUser };
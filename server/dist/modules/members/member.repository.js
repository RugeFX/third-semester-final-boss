import { db } from "../../db";
import { eq } from "drizzle-orm";
import { membersTable } from "../../db/schema";
export const findAll = async () => {
    return await db.query.membersTable.findMany({
        with: {
            user: {
                columns: {
                    id: true,
                    fullname: true,
                    username: true,
                    role: true
                }
            }
        }
    });
};
export const findById = async (memberId) => {
    return await db.query.membersTable.findFirst({
        where: eq(membersTable.id, memberId),
        with: {
            user: {
                columns: {
                    id: true,
                    fullname: true,
                    username: true,
                    role: true
                }
            }
        }
    });
};
export const findByUserId = async (userId) => {
    return await db.query.membersTable.findFirst({
        where: eq(membersTable.user_id, userId),
        with: {
            user: {
                columns: {
                    id: true,
                    fullname: true,
                    username: true,
                    role: true
                }
            }
        }
    });
};
export const create = async (memberData) => {
    const [newMember] = await db.insert(membersTable).values({
        ended_at: memberData.endedAt,
        user_id: memberData.userId
    }).returning();
    return newMember;
};
export const update = async (memberId, memberData) => {
    const [updatedMember] = await db.update(membersTable).set({
        ended_at: memberData.endedAt
    }).where(eq(membersTable.id, memberId)).returning();
    return updatedMember;
};
export const remove = async (memberId) => {
    const [deletedMember] = await db.delete(membersTable).where(eq(membersTable.id, memberId)).returning();
    return deletedMember;
};
export default { findAll, findById, findByUserId, create, update, remove };
//# sourceMappingURL=member.repository.js.map
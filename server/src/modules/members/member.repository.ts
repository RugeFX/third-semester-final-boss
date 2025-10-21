import { db } from "../../db";
import { eq } from "drizzle-orm";
import { membersTable } from "../../db/schema";
import { createMemberSchema, updateMemberSchema } from "./member.schema";
import { z } from "zod";

type newMember = z.infer<typeof createMemberSchema>;
type updatedMember = z.infer<typeof updateMemberSchema>;

// Get all members
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
}

// Find member by ID
export const findById = async (memberId: number) => {
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
}

// Find member by user ID
export const findByUserId = async (userId: number) => {
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
}

// Create a member
export const create = async (memberData: newMember) => {
    const [ newMember ] = await db.insert(membersTable).values({
        ended_at: memberData.endedAt,
        user_id: memberData.userId
    }).returning();

    return newMember;
}

// Update a member
export const update = async (memberId: number, memberData: updatedMember) => {
    const [ updatedMember ] = await db.update(membersTable).set({
        ended_at: memberData.endedAt
    }).where(eq(membersTable.id, memberId)).returning();

    return updatedMember;
}

// Delete a member
export const remove = async (memberId: number) => {
    const [ deletedMember ] = await db.delete(membersTable).where(
        eq(membersTable.id, memberId)
    ).returning();

    return deletedMember;
}

export default { findAll, findById, findByUserId, create, update, remove };
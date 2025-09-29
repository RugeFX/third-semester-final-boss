import { db } from "../../db";
import { eq } from "drizzle-orm";
import { membersTable } from "../../db/schema";
import HttpError from "../common/exceptions/http.error";

// Get all members
export const getAllMembers = async () => {
    const members = await db.query.membersTable.findMany({
        with: {
            user: true
        }
    });

    return members;
};

// Get member by ID
export const findMemberById = async (id: number) => {
    const member = await db.query.membersTable.findFirst({
        where: eq(membersTable.id, id),
        with: {
            user: true
        }
    });

    if (!member) throw new HttpError(404, "Member not found");

    return member;
};

// Get member by user ID
// export const findMemberByUserId = async (userId: number) => {
//     const member = await db.query.membersTable.findFirst({
//         where: eq(membersTable.user_id, userId),
//         with: {
//             user: true
//         }
//     });

//     if (!member) throw new HttpError(400, "Member not found");

//     return member;
// };

// Create a new member
export const createMember = async (joinedAt: Date, endedAt: Date, userId: number) => {
    const [ newMember ] = await db.insert(membersTable).values({ 
        joined_at: joinedAt, ended_at: endedAt, user_id: userId 
    }).returning();

    return newMember;
};

// Update a member
export const updateMember = async (memberId: number, endedAt: Date) => {
    await findMemberById(memberId);

    const [ updatedMember ] = await db.update(membersTable).set({ 
        ended_at: endedAt 
    }).where(eq(membersTable.id, memberId)).returning();

    return updatedMember;
};

// Delete a member
export const deleteMember = async (memberId: number) => {
    await findMemberById(memberId);

    const deletedMember = await db.delete(membersTable).where(eq(membersTable.id, memberId));

    return deletedMember;
};

export default { getAllMembers, findMemberById, createMember, updateMember, deleteMember };
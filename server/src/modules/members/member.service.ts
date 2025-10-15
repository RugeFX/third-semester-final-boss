import HttpError from "../common/exceptions/http.error";
import { createMemberSchema, updateMemberSchema } from "./member.schema";
import memberRepository from "./member.repository";
import { z } from "zod";

type createMemberInput = z.infer<typeof createMemberSchema>;
type updateMemberInput = z.infer<typeof updateMemberSchema>;

// Get all members
export const getAllMembers = async () => {
    const members = await memberRepository.findAll();

    return members;
};

// Get member by ID
export const findMemberById = async (id: number) => {
    const member = await memberRepository.findById(id);

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
export const createMember = async (memberData: createMemberInput) => {
    return await memberRepository.create(memberData);
};

// Update a member
export const updateMember = async (memberId: number, memberData: updateMemberInput) => {
    await findMemberById(memberId);

    return await memberRepository.update(memberId, memberData);
};

// Delete a member
export const deleteMember = async (memberId: number) => {
    await findMemberById(memberId);

    return await memberRepository.remove(memberId);
};

export default { getAllMembers, findMemberById, createMember, updateMember, deleteMember };
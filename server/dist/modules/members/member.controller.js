import memberService from "./member.service";
import { paramsSchema, createMemberSchema, updateMemberSchema, renewMembershipSchema } from "./member.schema";
import HttpError from "../../common/exceptions/http.error";
export const getAllMembers = async (_req, res) => {
    const members = await memberService.getAllMembers();
    res.status(200).json({
        success: true,
        message: "Members fetched successfully",
        data: members
    });
};
export const getMemberById = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const member = await memberService.findMemberById(id);
    res.status(200).json({
        success: true,
        message: "Member fetched successfully",
        data: member
    });
};
export const getMemberTransactions = async (req, res) => {
    const userId = req.user.id;
    const transactions = await memberService.getTransactionForMember(userId);
    res.status(200).json({
        success: true,
        message: "Member transactions fetched successfully",
        data: transactions
    });
};
export const createMember = async (req, res) => {
    const memberData = createMemberSchema.parse(req.body);
    const newMember = await memberService.createMember(memberData);
    if (!newMember)
        throw new HttpError(500, "Failed to create member");
    res.status(201).json({
        success: true,
        message: "Member created successfully",
        data: newMember
    });
};
export const updateMember = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const memberData = updateMemberSchema.parse(req.body);
    const adminUserId = req.user.id;
    const updatedMember = await memberService.updateMember(id, memberData, adminUserId);
    if (!updatedMember)
        throw new HttpError(500, "Failed to update member");
    res.status(200).json({
        success: true,
        message: "Member updated successfully",
        data: updatedMember
    });
};
export const renewMembership = async (req, res) => {
    const renewalData = renewMembershipSchema.parse(req.body);
    const userId = req.user.id;
    const updatedMember = await memberService.renewMembership(userId, renewalData);
    if (!updatedMember)
        throw new HttpError(500, "Failed to renew membership");
    res.status(200).json({
        success: true,
        message: "Membership renewed successfully",
        data: updatedMember
    });
};
export const deleteMember = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const adminUserId = req.user.id;
    const deletedMember = await memberService.deleteMember(id, adminUserId);
    if (!deletedMember)
        throw new HttpError(500, "Failed to delete member");
    res.status(200).json({
        success: true,
        message: "Member deleted successfully",
        data: deletedMember
    });
};
//# sourceMappingURL=member.controller.js.map
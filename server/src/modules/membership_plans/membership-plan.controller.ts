import { Request, Response } from "express";
import membershipPlanService from "./membership-plan.service";
import { paramsSchema, createMembershipPlanSchema, updateMembershipPlanSchema } from "./membership-plan.schema";
import HttpError from "../../common/exceptions/http.error";

// Get all membership plans
export const getAllMembershipPlans = async (_req: Request, res: Response) => {
    const membershipPlans = await membershipPlanService.getAllMembershipPlans();
    
    return res.status(200).json({ 
        success: true,
        message: "Membership plans fetched successfully",
        data: membershipPlans 
    });
};

// Get membership plan by ID
export const getMembershipPlanById = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const membershipPlan = await membershipPlanService.findMembershipPlanById(id);

    return res.status(200).json({ 
        success: true,
        message: "Membership plan fetched successfully",
        data: membershipPlan 
    });
};

// Create a new membership plan (Admin only)
export const createMembershipPlan = async (req: Request, res: Response) => {
    const membershipPlanData= createMembershipPlanSchema.parse(req.body);

    const newMembershipPlan = await membershipPlanService.createMembershipPlan(membershipPlanData);

    if (!newMembershipPlan) throw new HttpError(500, "Failed to create membership plan");

    return res.status(201).json({ 
        success: true,
        message: "Membership plan created successfully",
        data: newMembershipPlan 
    });
};

// Update a membership plan (Admin only)
export const updateMembershipPlan = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const membershipPlanData = updateMembershipPlanSchema.parse(req.body);

    const updatedMembershipPlan = await membershipPlanService.updateMembershipPlan(id, membershipPlanData);

    if (!updatedMembershipPlan) throw new HttpError(500, "Failed to update membership plan");

    return res.status(200).json({ 
        success: true,
        message: "Membership plan updated successfully",
        data: updatedMembershipPlan 
    });
};

// Delete a membership plan (Admin only)
export const deleteMembershipPlan = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const deletedMembershipPlan = await membershipPlanService.deleteMembershipPlan(id);

    if (!deletedMembershipPlan) throw new HttpError(500, "Failed to delete membership plan");

    return res.status(200).json({ 
        success: true,
        message: "Membership plan deleted successfully",
        data: deletedMembershipPlan
    });
};
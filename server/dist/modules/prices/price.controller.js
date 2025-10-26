import priceService from "./price.service";
import HttpError from "../../common/exceptions/http.error";
import { paramsSchema, categoryPriceParamsSchema, createPriceSchema, updatePriceSchema } from "./price.schema";
export const getAllPrices = async (_req, res) => {
    const prices = await priceService.getAllPrices();
    res.status(200).json({
        success: true,
        message: "Prices fetched successfully",
        data: prices
    });
};
export const getPriceById = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const price = await priceService.findPriceById(id);
    res.status(200).json({
        success: true,
        message: "Price fetched successfully",
        data: price
    });
};
export const getPricesByCategoryId = async (req, res) => {
    const { categoryId } = categoryPriceParamsSchema.parse(req.params);
    const prices = await priceService.getPricesByCategoryId(categoryId);
    res.status(200).json({
        success: true,
        message: "Prices fetched successfully",
        data: prices
    });
};
export const createPrice = async (req, res) => {
    const priceData = createPriceSchema.parse(req.body);
    const newPrice = await priceService.createPrice(priceData);
    if (!newPrice)
        throw new HttpError(500, "Failed to create price");
    res.status(201).json({
        success: true,
        message: "Price created successfully",
        data: newPrice
    });
};
export const updatePrice = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const priceData = updatePriceSchema.parse(req.body);
    const adminUserId = req.user.id;
    const updatedPrice = await priceService.updatePrice(id, priceData, adminUserId);
    if (!updatedPrice)
        throw new HttpError(500, "Failed to update price");
    res.status(200).json({
        success: true,
        message: "Price updated successfully",
        data: updatedPrice
    });
};
export const deletePrice = async (req, res) => {
    const { id } = paramsSchema.parse(req.params);
    const adminUserId = req.user.id;
    const deletedPrice = await priceService.deletePrice(id, adminUserId);
    if (!deletedPrice)
        throw new HttpError(500, "Failed to delete price");
    res.status(200).json({
        success: true,
        message: "Price deleted successfully",
        data: deletedPrice
    });
};
//# sourceMappingURL=price.controller.js.map
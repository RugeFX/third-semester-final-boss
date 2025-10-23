import HttpError from "../../common/exceptions/http.error";
import auditLogService from "../audit_logs/audit-log.service";
import categoryService from "../categories/category.service";
import priceRepository from "./price.repository";
import { createPriceSchema, updatePriceSchema } from "./price.schema";
import { z } from "zod";

type createPriceInput = z.infer<typeof createPriceSchema>;
type updatePriceInput = z.infer<typeof updatePriceSchema>;

// Get all prices with category
export const getAllPrices = async () => {
    const prices = await priceRepository.findAll();

    return prices;
};

// Find price by ID
export const findPriceById = async (priceId: number) => {
    const price = await priceRepository.findById(priceId);

    if (!price) throw new HttpError(404, "Price not found");

    return price;
};

// Find prices by category ID
export const getPricesByCategoryId = async (categoryId: number) => {
    const prices = await priceRepository.findAllByCategoryId(categoryId);

    if (!prices) throw new HttpError(404, "Prices not found");

    return prices;
};

// Create a new price
export const createPrice = async (priceData: createPriceInput) => {
    await categoryService.findCategoryById(priceData.categoryId);

    if (priceData.isActive !== false) {
        if (await priceRepository.findActivePriceByCategoryAndType(priceData.categoryId, priceData.type))
            throw new HttpError(409, `Price with type '${priceData.type}' for this category already exists and is active`);
    }

    return await priceRepository.create(priceData);
};

// Update a price
export const updatePrice = async (priceId: number, priceData: updatePriceInput, adminUserId: number) => {
    const oldPrice = await findPriceById(priceId);
    await categoryService.findCategoryById(priceData.categoryId);

    if (priceData.isActive !== false) {
        const existingPrice = await priceRepository.findActivePriceByCategoryAndType(priceData.categoryId, priceData.type);

        if (existingPrice && existingPrice.id !== priceId)
            throw new HttpError(409, `Price with type '${priceData.type}' for this category already exists and is active`);
    }

    const updatedPrice = await priceRepository.update(priceId, priceData);

    // Create audit log for update
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) updated price (ID: ${priceId}). Old Data: ${JSON.stringify(oldPrice)}, New Data: ${JSON.stringify(updatedPrice)}`,
            type: "PRICE_UPDATE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for price update:", error);
    }


    return updatedPrice;
}

// Delete a price
export const deletePrice = async (priceId: number, adminUserId: number) => {
    await findPriceById(priceId);

    const deletedPrice = await priceRepository.remove(priceId);

    // Create audit log for deletion
    try {
        await auditLogService.createAuditLog({
            context: `Admin (ID: ${adminUserId}) deleted price (ID: ${priceId}). Data: ${JSON.stringify(deletedPrice)}`,
            type: "PRICE_DELETE",
            createdBy: adminUserId
        });
    } catch (error) {
        console.error("Failed to create audit log for price deletion:", error);
    }

    return deletedPrice;
};

export default { getAllPrices, findPriceById, getPricesByCategoryId, createPrice, updatePrice, deletePrice };
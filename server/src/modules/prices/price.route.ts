import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import {
    getAllPrices,
    getPriceById,
    createPrice,
    updatePrice,
    deletePrice
} from "./price.controller";

const router = Router();

// Public routes
router.get("/", getAllPrices);
router.get("/:id", getPriceById);

// Admin routes
router.post("/", authenticateJWT, authorizeAdmin, createPrice);
router.put("/:id", authenticateJWT, authorizeAdmin, updatePrice);
router.delete("/:id", authenticateJWT, authorizeAdmin, deletePrice);

export default router;
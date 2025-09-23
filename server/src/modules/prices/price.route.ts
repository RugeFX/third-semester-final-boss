import { Router } from "express";
import {
    getAllPrices,
    getPriceById,
    createPrice,
    updatePrice,
    deletePrice
} from "./price.controller";

const router = Router();

router.get("/", getAllPrices);
router.get("/:id", getPriceById);
router.post("/", createPrice);
router.put("/:id", updatePrice);
router.delete("/:id", deletePrice);

export default router;
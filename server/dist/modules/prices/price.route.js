import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import { getAllPrices, getPriceById, getPricesByCategoryId, createPrice, updatePrice, deletePrice } from "./price.controller";
const router = Router();
router.get("/", getAllPrices);
router.get("/:id", getPriceById);
router.get("/:categoryId/fee", getPricesByCategoryId);
router.post("/", authenticateJWT, authorizeAdmin, createPrice);
router.put("/:id", authenticateJWT, authorizeAdmin, updatePrice);
router.delete("/:id", authenticateJWT, authorizeAdmin, deletePrice);
export default router;
//# sourceMappingURL=price.route.js.map
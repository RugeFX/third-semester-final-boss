import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "./category.controller";

const router = Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", authenticateJWT, authorizeAdmin, createCategory);
router.put("/:id", authenticateJWT, authorizeAdmin, updateCategory);
router.delete("/:id", authenticateJWT, authorizeAdmin, deleteCategory);

export default router;
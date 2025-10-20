import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import {
    getAllParkingLevels,
    getParkingLevelById,
    createParkingLevel,
    updateParkingLevel,
    deleteParkingLevel
} from "./parking-level.controller";

const router = Router();

// Public routes
router.get("/", getAllParkingLevels);
router.get("/:id", getParkingLevelById);

// Admin routes
router.post("/", authenticateJWT, authorizeAdmin, createParkingLevel);
router.put("/:id", authenticateJWT, authorizeAdmin, updateParkingLevel);
router.delete("/:id", authenticateJWT, authorizeAdmin, deleteParkingLevel);

export default router;
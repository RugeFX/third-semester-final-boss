import { Router } from "express";
import {
    getAllParkingLevels,
    getParkingLevelById,
    createParkingLevel,
    updateParkingLevel,
    deleteParkingLevel
} from "./parking-level.controller";

const router = Router();

router.get("/", getAllParkingLevels);
router.get("/:id", getParkingLevelById);
router.post("/", createParkingLevel);
router.put("/:id", updateParkingLevel);
router.delete("/:id", deleteParkingLevel);

export default router;
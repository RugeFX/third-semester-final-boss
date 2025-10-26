import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import { getAllVehicleDetails, getVehicleDetailById, createVehicleDetail, updateVehicleDetail, deleteVehicleDetail } from "./vehicle-detail.controller";
const router = Router();
router.use(authenticateJWT, authorizeAdmin);
router.get("/", getAllVehicleDetails);
router.get("/:id", getVehicleDetailById);
router.post("/", createVehicleDetail);
router.put("/:id", updateVehicleDetail);
router.delete("/:id", deleteVehicleDetail);
export default router;
//# sourceMappingURL=vehicle-detail.route.js.map
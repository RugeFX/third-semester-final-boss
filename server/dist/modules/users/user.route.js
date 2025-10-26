import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, changeUserPassword, resetUserPassword } from "./user.controller";
const router = Router();
router.use(authenticateJWT);
router.get("/", authorizeAdmin, getAllUsers);
router.get("/:id", authorizeAdmin, getUserById);
router.post("/", authorizeAdmin, createUser);
router.put("/:id", authorizeAdmin, updateUser);
router.put("/:id/password", authorizeAdmin, resetUserPassword);
router.delete("/:id", authorizeAdmin, deleteUser);
router.post("/me/change-password", changeUserPassword);
export default router;
//# sourceMappingURL=user.route.js.map
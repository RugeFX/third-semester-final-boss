import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "./user.controller";

const router = Router();

router.use(authenticateJWT, authorizeAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
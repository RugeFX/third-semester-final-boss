import { Router } from "express";
import { authenticateJWT, authorizeAdmin } from "../../middleware/auth";
import { getAllTransactions, createTransactionEntry, processTransactionPayment, updateTransactionExit, getTransactionByAccessCode, manuallyUpdateTransaction, deleteTransaction } from "./transaction.controller";
const router = Router();
router.get("/:accessCode", getTransactionByAccessCode);
router.post("/entry", createTransactionEntry);
router.post("/:accessCode/payment", processTransactionPayment);
router.post("/:accessCode/exit", updateTransactionExit);
router.get("/", authenticateJWT, authorizeAdmin, getAllTransactions);
router.put("/manage/:accessCode", authenticateJWT, authorizeAdmin, manuallyUpdateTransaction);
router.delete("/manage/:accessCode", authenticateJWT, authorizeAdmin, deleteTransaction);
export default router;
//# sourceMappingURL=transaction.route.js.map
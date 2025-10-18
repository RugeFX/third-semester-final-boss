import { Router } from "express";
import {
    getAllTransactions,
    createTransactionEntry,
    processTransactionPayment,
    updateTransactionExit,
    getTransactionByAccessCode,
    manuallyUpdateTransaction,
    deleteTransaction
} from "./transaction.controller";

const router = Router();

router.get("/", getAllTransactions);
router.get("/:accessCode", getTransactionByAccessCode);
router.post("/entry", createTransactionEntry);
router.post("/:accessCode/payment", processTransactionPayment);
router.post("/:accessCode/exit", updateTransactionExit);
router.put("/manage/:accessCode", manuallyUpdateTransaction);
router.delete("/manage/:accessCode", deleteTransaction);

export default router;
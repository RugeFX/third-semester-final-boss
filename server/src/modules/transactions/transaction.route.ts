import { Router } from "express";
import {
    getAllTransactions,
    createTransactionEntry,
    updateTransactionExit,
    getTransactionByAccessCode,
    // createTransaction,
    // updateTransaction,
    // deleteTransaction
} from "./transaction.controller";

const router = Router();

router.get("/", getAllTransactions);
router.get("/:accessCode", getTransactionByAccessCode);
router.post("/entry", createTransactionEntry);
router.post("/:accessCode/exit", updateTransactionExit);
// router.put("/:id", updateTransaction);
// router.delete("/:id", deleteTransaction);

export default router;
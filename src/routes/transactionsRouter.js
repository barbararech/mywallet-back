import {
  AddIncome,
  AddExpense,
  ListTransactions,
} from "../controllers/transactionsControllers.js";
import { Router } from "express";

const router = Router();

router.post("/income", AddIncome);
router.post("/expense", AddExpense);
router.get("/transactions", ListTransactions);

export default router;

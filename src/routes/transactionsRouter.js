import {
  AddIncome,
  AddExpense,
  ListTransactions,
  DeleteTransaction,
} from "../controllers/transactionsControllers.js";
import { Router } from "express";
import { TokenValidationMiddleware } from "../middlewares/TokenValidationMiddleware.js";
import { ValidateTransaction } from "../middlewares/schemaValidationMiddleware.js";

const router = Router();

router.post(
  "/income",
  TokenValidationMiddleware,
  ValidateTransaction,
  AddIncome
);

router.post(
  "/expense",
  TokenValidationMiddleware,
  ValidateTransaction,
  AddExpense
);

router.get("/transactions", TokenValidationMiddleware, ListTransactions);

router.post("/delete", TokenValidationMiddleware, DeleteTransaction);

export default router;

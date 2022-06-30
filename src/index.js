import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  CreateUser,
  LoginUser,
  LogoutUser,
} from "./controllers/userControllers.js";
import {
  AddIncome,
  AddExpense,
  ListTransactions,
} from "./controllers/transactionsControllers.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());


app.post("/signup", CreateUser);

app.post("/login", LoginUser);

app.get("/signout", LogoutUser);

app.post("/income", AddIncome);

app.post("/expense", AddExpense);

app.get("/transactions", ListTransactions);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server On!"));

import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import transactionsRouter from "./routes/transactionsRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(transactionsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server On!"));

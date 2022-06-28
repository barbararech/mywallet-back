import express, { json } from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";
import joi from "joi";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.URL_MONGO);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("mywallet");
});

app.post("/signup"), async (req, res) => {};

app.post("/login"), async (req, res) => {};

app.get("/transactions"), async (req, res) => {};

app.post("/income"), async (req, res) => {};

app.get("/expense"), async (req, res) => {};

app.listen(5000, () => console.log("Server On!"));

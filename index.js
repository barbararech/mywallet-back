import express, { json } from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";
import joi from "joi";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.URL_MONGO);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("mywallet");
  console.log("mongo is connected");
});

app.post("/signup", async (req, res) => {
  const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const user = req.body;
  const { name, email, password } = req.body;

  const validation = signupSchema.validate(
    { name, email, password },
    { abortEarly: false }
  );

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const userExist = await db.collection("users").findOne({ email });

    if (userExist) {
      return res.sendStatus(409);
    }

    await db.collection("users").insertOne({ ...user, password: passwordHash });

    return res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { email, password } = req.body;
  const validation = loginSchema.validate(
    { email, password },
    { abortEarly: false }
  );

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user || password !== user.password) {
      return res.sendStatus(403);
    }
    const name = user.name;

    return res.status(200).send({ email, password, name });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/income", async (req, res) => {});

app.get("/expense", async (req, res) => {});

app.get("/transactions", async (req, res) => {});

app.listen(5000, () => console.log("Server On!"));

import express, { json } from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dayjs from "dayjs";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      const { name, email } = user;

      await db.collection("sessions").insertOne({
        token,
        userId: user._id,
      });

      return res.status(200).send({ name, email, token });
    } else {
      return res.status(403).send("Email ou senha invália!");
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/income", async (req, res) => {
  const { authorization } = req.headers;
  const { value, description, type } = req.body;
  const date = dayjs().format("DD/MM");
  const token = authorization?.replace("Bearer ", "");

  const incomeSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().valid("income").required(),
  });

  const validation = incomeSchema.validate(
    { value, description, type },
    { abortEarly: false }
  );

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
      return res.sendStatus(401);
    }

    const transactions = await db
      .collection("transactions")
      .insertOne({ value, description, type, date, userId: session.userId });

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/expense", async (req, res) => {
  const { authorization } = req.headers;
  const { value, description, type } = req.body;
  const date = dayjs().format("DD/MM");
  const token = authorization?.replace("Bearer ", "");

  const expenseSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().valid("expense").required(),
  });

  const validation = expenseSchema.validate(
    { value, description, type },
    { abortEarly: false }
  );

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
      return res.sendStatus(401);
    }

    const transactions = await db
      .collection("transactions")
      .insertOne({ value, description, type, date, userId: session.userId });

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/transactions", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
      return res.sendStatus(401);
    }

    const transactions = await db
      .collection("transactions")
      .find({ userId: new ObjectId(session.userId) })
      .toArray();

    res.send(transactions);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/signout", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
      return res.sendStatus(401);
    }

    await db.collection("sessions").deleteOne({ token });

    res.status(200).send("Usuário deslogado com sucesso!");
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(5000, () => console.log("Server On!"));

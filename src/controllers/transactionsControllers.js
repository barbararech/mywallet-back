import dayjs from "dayjs";
import { db, objectId } from "../dbStrategy/mongo.js";
import { transactionSchema } from "../schemas/transactionSchema.js";

export async function AddIncome(req, res) {
  const { authorization } = req.headers;
  const { value, description, type } = req.body;
  const date = dayjs().format("DD/MM");
  const token = authorization?.replace("Bearer ", "");

  const validation = transactionSchema.validate(
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
}

export async function AddExpense(req, res) {
  const { authorization } = req.headers;
  const { value, description, type } = req.body;
  const date = dayjs().format("DD/MM");
  const token = authorization?.replace("Bearer ", "");

  const validation = transactionSchema.validate(
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
}

export async function ListTransactions(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
      return res.sendStatus(401);
    }

    const transactions = await db
      .collection("transactions")
      .find({ userId: new objectId(session.userId) })
      .toArray();

    res.send(transactions);
  } catch (error) {
    res.sendStatus(500);
  }
}

import dayjs from "dayjs";
import { db, objectId } from "../dbStrategy/mongo.js";

export async function AddIncome(req, res) {
  const { value, description, type } = req.body;
  const { user } = res.locals;
  const date = dayjs().format("DD/MM");

  try {
    await db.collection("transactions").insertOne({
      value,
      description,
      type,
      date,
      userId: new objectId(user._id),
    });

    res.sendStatus(201);
  } catch (error) {
    console.log("não deu");
    res.sendStatus(500);
  }
}

export async function AddExpense(req, res) {
  const { value, description, type } = req.body;
  const { user } = res.locals;
  const date = dayjs().format("DD/MM");

  try {
    const transactions = await db.collection("transactions").insertOne({
      value,
      description,
      type,
      date,
      userId: new objectId(user._id),
    });

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function ListTransactions(req, res) {
  const { user } = res.locals;

  try {
    const transactions = await db
      .collection("transactions")
      .find({ userId: new objectId(user._id) })
      .toArray();

    res.send(transactions);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function DeleteTransaction(req, res) {
  const { user } = res.locals;
  const { _id } = req.body;

  try {
    await db.collection("transactions").deleteOne({ _id: new objectId(_id) });

    const transactions = await db
      .collection("transactions")
      .find({ userId: new objectId(user._id) })
      .toArray();

    res.status(200).send(transactions);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function EditTransaction(req, res) {
  const { user } = res.locals;
  const { _id, value, description } = req.body;
  console.log(_id);
  console.log(req.body);

  try {
    await db
      .collection("transactions")
      .updateOne({ _id: new objectId(_id) }, { $set: { value, description } });

    res.status(200).send("Entrada atualizada com sucesso!");
  } catch (error) {
    res.sendStatus(500);
  }
}

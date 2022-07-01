import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../dbStrategy/mongo.js";
import { authSignupSchema, authLoginSchema } from "../schemas/authSchema.js";

export async function CreateUser(req, res) {
  const user = req.body;
  const { name, email, password } = req.body;

  const validation = authSignupSchema.validate(
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
}

export async function LoginUser(req, res) {
  const { email, password } = req.body;
  const validation = authLoginSchema.validate(
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
}

export async function LogoutUser(req, res) {
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
}

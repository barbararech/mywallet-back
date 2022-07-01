import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.URL_MONGO);
let db;

mongoClient.connect(() => {
  db = mongoClient.db(process.env.MONGO_DATABASE);
  console.log("mongo is connected");
});

const objectId = ObjectId;

export { db, objectId };

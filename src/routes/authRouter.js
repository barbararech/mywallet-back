import {
  CreateUser,
  LoginUser,
  LogoutUser,
} from "../controllers/authControllers.js";
import { Router } from "express";

const router = Router();

router.post("/signup", CreateUser);
router.post("/login", LoginUser);
router.get("/signout", LogoutUser);

export default router;

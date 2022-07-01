import {
  CreateUser,
  LoginUser,
  LogoutUser,
} from "../controllers/authControllers.js";
import { Router } from "express";
import { TokenValidationMiddleware } from "../middlewares/TokenValidationMiddleware.js";
import {
  ValidateSignUp,
  ValidateLogin,
} from "../middlewares/schemaValidationMiddleware.js";

const router = Router();

router.post("/signup", ValidateSignUp, CreateUser);
router.post("/login", ValidateLogin, LoginUser);
router.get("/signout", TokenValidationMiddleware, LogoutUser);

export default router;

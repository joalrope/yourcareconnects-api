import { Router } from "express";
import { body } from "express-validator";
import { validateFields } from "../middlewares";
import { login } from "../controllers";

export const authRouter = Router();

authRouter.post(
  "/login",
  [
    body("email", "Mail is required").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  login
);

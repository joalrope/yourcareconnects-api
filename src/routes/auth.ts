import { Router } from "express";
import { body } from "express-validator";
import { validateFields } from "../middlewares";
import { changePassword, forgotPassword, login } from "../controllers";

export const authRouter = Router();

authRouter.post(
  "/login",
  [
    body("email", "email is required").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  login
);

authRouter.post(
  "/forgotPassword",
  [body("email", "email is required").isEmail()],
  forgotPassword
);

authRouter.post(
  "/changePassword",
  [body("token", "token is required").isEmail(),
  body("password", "password is required").isEmail()],
  changePassword
);

import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares";
import { login } from "../controllers";

export const authRouter = Router();

authRouter.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  login
);

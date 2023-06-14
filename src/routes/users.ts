import { Router } from "express";
import { body, check } from "express-validator";

import { validateFields, validateJWT } from "../middlewares";
import { emailAlreadyExists, userIdAlreadyExists } from "../helpers";
import {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} from "../controllers";

export const userRouter = Router();

userRouter.post(
  "/",
  [
    body("name", "El nombre es obligatorio").not().isEmpty(),
    body("password", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    body("email", "El correo no es válido").isEmail(),
    body("email").custom(emailAlreadyExists),
    validateFields,
  ],
  createUser
);

userRouter.get("/", getUsers);

userRouter.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  getUser
);

userRouter.put(
  "/:id",
  [
    validateJWT,
    check("id", "Debe indicar un ID válido").notEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  updateUser
);

userRouter.delete(
  "/:id",
  [
    validateJWT,
    check("id", "Debe indicar un ID válido").notEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  deleteUser
);

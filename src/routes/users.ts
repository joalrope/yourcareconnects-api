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
  getUsersByServices,
} from "../controllers";
import { updateUserContacts } from "../controllers/users";

export const userRouter = Router();

userRouter.post(
  "/",
  [
    body("names", "Names is required").not().isEmpty(),
    body("password", "The password must be more than 6 letters").isLength({
      min: 6,
    }),
    body("email", "The email is invalid").isEmail(),
    body("email").custom(emailAlreadyExists),
    validateFields,
  ],
  createUser
);

userRouter.get("/", getUsers);
userRouter.get("/services/", getUsersByServices);

userRouter.get(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  getUser
);

userRouter.put(
  "/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  updateUser
);

userRouter.delete(
  "/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID ").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  deleteUser
);

userRouter.put(
  "/contacts/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    body("contact", "The contact is required").not().isEmpty(),
    body("contact", "The contact is invalid").isEmail(),
    validateFields,
  ],
  updateUserContacts
);

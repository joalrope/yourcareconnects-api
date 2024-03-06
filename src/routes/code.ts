import { Router } from "express";
import { body, check } from "express-validator";
import { createCode, getCode, getCodes, inactivateCode } from "../controllers";
import { validateFields, validateJWT } from "../middlewares";

export const codeRouter = Router();

codeRouter.post(
  "/",
  [
    body("code", "You must provide an ID").notEmpty(),
    body("email", "The email is invalid").isEmail(),
    validateFields,
  ],
  createCode
);

codeRouter.get("/", [validateJWT, validateFields], getCodes);

codeRouter.get(
  "/:code",
  [check("code", "You must provide an ID").notEmpty(), validateFields],
  getCode
);

codeRouter.put(
  "/:code",
  [check("code", "You must provide an ID").notEmpty(), validateFields],
  inactivateCode
);

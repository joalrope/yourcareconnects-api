import { Router } from "express";
import { check } from "express-validator";
import { getCode } from "../controllers";
import { validateFields } from "../middlewares";

export const codeRouter = Router();

codeRouter.get(
  "/:code",
  [check("code", "You must provide an ID").notEmpty(), validateFields],
  getCode
);

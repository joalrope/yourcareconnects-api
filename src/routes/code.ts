import { Router } from "express";
import { check } from "express-validator";
import { getCode, setCode } from "../controllers";
import { validateFields } from "../middlewares";

export const codeRouter = Router();

codeRouter.post(
  "/:code",
  [check("code", "You must provide an ID").notEmpty(), validateFields],
  setCode
);

codeRouter.get(
  "/:code",
  [check("code", "You must provide an ID").notEmpty(), validateFields],
  getCode
);

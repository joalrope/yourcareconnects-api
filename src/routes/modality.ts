import { Router } from "express";
import { body, check } from "express-validator";

import { validateFields, validateJWT } from "../middlewares";
import {
  createModality,
  deleteModality,
  getModalities,
  getModality,
  updateModality,
} from "../controllers";

export const modalityRouter = Router();

modalityRouter.post(
  "/",
  [
    validateJWT,
    body("title", "The title is required").not().isEmpty(),
    validateFields,
  ],
  createModality
);

modalityRouter.get("/", getModalities);

modalityRouter.get(
  "/:id",
  [validateJWT, check("id", "Not a valid ID").isMongoId(), validateFields],
  getModality
);

modalityRouter.put(
  "/",
  [validateJWT, body("title", "The title is required").not().isEmpty()],
  updateModality
);

modalityRouter.delete(
  "/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    validateFields,
  ],
  deleteModality
);

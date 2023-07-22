import { Router } from "express";
import { body, check } from "express-validator";

import { validateFields, validateJWT } from "../middlewares";
import { getRoles, getRole, createRole, deleteRole } from "../controllers";

export const roleRouter = Router();

roleRouter.post(
  "/",
  [
    validateJWT,
    body("name", "Name is required").not().isEmpty(),
    validateFields,
  ],
  createRole
);

roleRouter.get("/", getRoles);

roleRouter.get(
  "/:id",
  [check("id", "Not a valid ID").isMongoId(), validateFields],
  getRole
);

roleRouter.delete(
  "/:id",
  [validateJWT, check("id", "Not a valid ID").isMongoId(), validateFields],
  deleteRole
);

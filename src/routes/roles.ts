import { Router } from "express";
import { body, check } from "express-validator";

import { validateFields, validateJWT } from "../middlewares";
import { getRoles, getRole, createRole, deleteRole } from "../controllers";

export const roleRouter = Router();

roleRouter.post(
  "/",
  [
    validateJWT,
    body("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createRole
);

roleRouter.get("/", getRoles);

roleRouter.get(
  "/:id",
  [check("id", "No es un ID válido").isMongoId(), validateFields],
  getRole
);

roleRouter.delete(
  "/:id",
  [validateJWT, check("id", "No es un ID válido").isMongoId(), validateFields],
  deleteRole
);

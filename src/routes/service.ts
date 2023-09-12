import { Router } from "express";
import { body, check } from "express-validator";

import { validateFields, validateJWT } from "../middlewares";
import {
  createService,
  getService,
  updateService,
  deleteService,
  getServices,
} from "../controllers";

export const serviceRouter = Router();

serviceRouter.post(
  "/",
  [body("title", "The title is required").not().isEmpty(), validateFields],
  createService
);

serviceRouter.get("/", getServices);

serviceRouter.get(
  "/:id",
  [check("id", "Not a valid ID").isMongoId(), validateFields],
  getService
);

serviceRouter.put(
  "/",
  [
    body("parent", "The parent is required").not().isEmpty(),
    body("title", "The title is required").not().isEmpty(),
  ],
  updateService
);

serviceRouter.delete(
  "/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    validateFields,
  ],
  deleteService
);

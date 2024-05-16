import { Router } from "express";
import { validateJWT } from "../middlewares";
import {
  clearContacts,
  ratingsNormalize,
  userHardDelete,
} from "../controllers";

export const devRouter = Router();

devRouter.get("/clearContacts", [validateJWT], clearContacts);

devRouter.get("/userHardDelete/:email", [validateJWT], userHardDelete);

devRouter.get("/ratingsNormalize", [validateJWT], ratingsNormalize);

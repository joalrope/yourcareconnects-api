import { Router } from "express";
import { validateJWT } from "../middlewares";
import { clearContacts, userHardDelete } from "../controllers";

export const devRouter = Router();

devRouter.get("/clearContacts", [validateJWT], clearContacts);

devRouter.get("/userHardDelete", [validateJWT], userHardDelete);

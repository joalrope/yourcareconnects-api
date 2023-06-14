import { Router } from "express";

import { validateFileToUpload, validateJWT } from "../middlewares";
import { fileUpload } from "../controllers";

export const uploadRouter = Router();

uploadRouter.post("/", [validateJWT, validateFileToUpload], fileUpload);

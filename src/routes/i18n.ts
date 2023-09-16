import { Router } from "express";
import { geti18n } from "../controllers";

export const i18nRouter = Router();

i18nRouter.get("/", [], geti18n);

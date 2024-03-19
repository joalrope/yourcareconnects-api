import { Router } from "express";
import { uploader } from "../middlewares/multer";
import { validateJWT } from "../middlewares/validate-jwt";
import { deleteFile, getDoc, getFiles, uploadDoc } from "../controllers";

export const uploadRouter = Router();

uploadRouter.use(validateJWT);

uploadRouter.post("/files", uploader, uploadDoc);
uploadRouter.get("/files/:id/:type", [], getFiles);
uploadRouter.get("/docs/:id/:name", [], getDoc);
uploadRouter.delete("/docs/:id/:name", [], deleteFile);

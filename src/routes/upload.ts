import { Router } from "express";
import { uploader } from "../middlewares/multer";
import { validateJWT } from "../middlewares/validate-jwt";
import { getDocs, getImages, uploadDoc, uploadImage } from "../controllers";

export const uploadRouter = Router();

uploadRouter.use(validateJWT);

uploadRouter.post("/images/:place", uploader, uploadImage);
uploadRouter.post("/docs", uploader, uploadDoc);
uploadRouter.get("/images", [], getImages);
uploadRouter.get("/docs", uploader, getDocs);

//import fs from "fs";
//import { mkdir, readdir, unlink } from "fs/promises";
import path from "path";
import { Request } from "express";
import multer, { FileFilterCallback as FFCB } from "multer";
import { jwtParse } from "../helpers/jwt";

const storage = multer.diskStorage({
  destination: async (_req: Request, _file, cb) => {
    const dir = path.join(__dirname, `../../uploads`);

    cb(null, dir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const token = req.headers["x-token"];
    const { uid } = jwtParse(token);
    const { place } = req.params;

    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, `${uid}-${place}-${file.originalname}`);
      return;
    }

    cb(null, `${uid}-${file.originalname}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FFCB) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000 },
});

export const uploader = upload.array("file", 1);

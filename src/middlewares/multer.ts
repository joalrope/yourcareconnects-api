//import fs from "fs";
//import { mkdir, readdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";
import { Request } from "express";
import multer, { FileFilterCallback as FFCB } from "multer";
import { jwtParse } from "../helpers/jwt";
import { mkdir } from "fs/promises";

const storage = multer.diskStorage({
  destination: async (req: Request, file: Express.Multer.File, cb) => {
    const token = req.headers["x-token"];
    const { uid } = jwtParse(token);
    let rootDir = path.join(__dirname, `../../uploads/${uid}`);
    let dir!: string;

    if (!fs.existsSync(`${rootDir}`)) {
      await mkdir(`${rootDir}`);
    }

    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      dir = `${rootDir}/images`;
      if (!fs.existsSync(dir)) {
        await mkdir(`${dir}`);
      }
    }

    if (file.mimetype === "application/pdf") {
      dir = `${rootDir}/docs`;
      if (!fs.existsSync(dir)) {
        await mkdir(`${dir}`);
      }
    }

    cb(null, dir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    console.log({ file });
    cb(null, file.originalname);
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

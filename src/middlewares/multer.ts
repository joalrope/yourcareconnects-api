//import fs from "fs";
//import { mkdir, readdir, unlink } from "fs/promises";
import fs from "fs";
import path from "path";
import { Request } from "express";
import multer, { FileFilterCallback as FFCB } from "multer";
import { jwtParse } from "../helpers/jwt";
import { mkdir } from "fs/promises";

const diskMountPath =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "../../../Backend/")
    : process.env.DISK_MOUNT_PATH;

const storage = multer.diskStorage({
  destination: async (req: Request, file: Express.Multer.File, cb) => {
    const token = req.headers["x-token"];
    const { uid } = jwtParse(token);
    let uploadsPath = `${diskMountPath}/uploads`;

    if (!fs.existsSync(uploadsPath)) {
      await mkdir(uploadsPath);
    }

    let userDir = `${uploadsPath}/${uid}`;

    let docsDir!: string;

    if (!fs.existsSync(`${userDir}`)) {
      await mkdir(`${userDir}`);
    }

    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      docsDir = `${userDir}/images`;
      if (!fs.existsSync(docsDir)) {
        await mkdir(`${docsDir}`);
      }
    }

    if (file.mimetype === "application/pdf") {
      docsDir = `${userDir}/docs`;
      if (!fs.existsSync(docsDir)) {
        await mkdir(`${docsDir}`);
      }
    }

    cb(null, docsDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
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

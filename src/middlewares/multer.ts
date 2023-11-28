import fs from "fs";
//import path from "path";
import { Request } from "express";
import multer, { FileFilterCallback as FFCB } from "multer";
import { jwtParse } from "../helpers/jwt";

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    const token = req.headers["x-token"];
    const { uid } = jwtParse(token);
    //const dir = `${}./uploads/images/${uid}`;
    const dir = `./uploads/images/${uid}`;
    //const dir = path.join(__dirname, `../../uploads/images/${uid}`);

    console.log(dir);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FFCB) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 1000000 } });
export const uploader = upload.array("image", 1);

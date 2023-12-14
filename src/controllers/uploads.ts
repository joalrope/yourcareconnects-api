import { Request as Req, Response as Resp } from "express";
import { glob } from "glob";
import path from "path";
import fs from "fs";
import { mkdir, readdir, rename, unlink } from "fs/promises";
import { IUser, User } from "../models";
import { jwtParse } from "../helpers/jwt";

interface imgData {
  id: string;
  name: string;
  userId: string;
  image: string;
}

export const uploadImage = async (req: Req, res: Resp) => {
  const token = req.headers["x-token"];
  const { uid } = jwtParse(token);
  const dir = path.join(__dirname, `../../uploads`);

  const files = await readdir(dir);

  files.forEach(async (file) => {
    const [id, place, name] = file.split("-");
    let user: IUser | null = null;

    if (place && name) {
      try {
        user = User.find({ id });
      } catch (error) {
        console.error("Error finding user:", error);
      }

      if (user) {
        const userProfileImagePath = path.join(
          __dirname,
          `../../uploads/images/${uid}/${place}`
        );

        if (fs.existsSync(userProfileImagePath)) {
          const files = await readdir(userProfileImagePath);

          files.forEach(async (file) => {
            try {
              await unlink(path.join(userProfileImagePath, file));
            } catch (error) {
              console.error("Error deleting file:", error);
            }
          });
        }

        if (!fs.existsSync(`${dir}/images/${uid}/${place}`)) {
          try {
            await mkdir(`${dir}/images/${uid}/${place}`, { recursive: true });
          } catch (error) {
            console.error("Error creating directory:", error);
          }
        }

        const oldPath = path.join(__dirname, `../../uploads/${file}`);
        const newPath = path.join(
          __dirname,
          `../../uploads/images/${uid}/${place}/${name}`
        );

        try {
          await rename(oldPath, newPath);

          return res.status(200).json({
            ok: true,
            msg: `Successfully uploaded Image to ${uid}`,
            result: { image: newPath.split("\\").pop() },
          });
        } catch (error) {
          console.error("Error renaming file:", error);
        }
      }
    }
    return;
  });
  return;
};

export const uploadDoc = async (req: Req, res: Resp) => {
  const token = req.headers["x-token"];
  const { uid } = jwtParse(token);
  const dir = path.join(__dirname, `../../uploads`);

  console.log({ uid });

  const files = await readdir(dir);

  files.forEach(async (file) => {
    console.log(file);
  });

  return res.status(200).json({
    ok: true,
    msg: "Successfully uploaded Docs",
    result: { doc: "doc.pdf" },
  });
};

export const getImage = async (req: Req, res: Resp) => {
  const { img, userId } = req.params;

  const url = path.join(__dirname, `../../uploads/images/${userId}/${img}`);

  if (fs.existsSync(url)) {
    return res.status(200).json({
      ok: true,
      msg: "Image found",
      result: { url: `/images/${userId}/${img}` },
    });
  } else {
    return res.status(409).json({
      ok: false,
      msg: "Image not found",
      result: { url: "/images/man.png" },
    });
  }
};

export const getImages = async (_req: Req, res: Resp) => {
  const data: string[][] = await searchImages("uploads/images/**/*");

  imagesPopulate(data)
    .then((result) => {
      res.status(200).json({
        ok: true,
        msg: "Successfully catched files",
        result,
      });
    })
    .catch((error) => {
      console.log("an error occurred during the operation:", error);
    });
};
export const getDocs = async (req: Req, res: Resp) => {
  const token = req.headers["x-token"];
  const { uid } = jwtParse(token);
  const dir = path.join(__dirname, `../../uploads/docs/${uid}`);

  const files = await readdir(dir);

  res.status(200).json({
    ok: true,
    msg: "files successfully obtained",
    result: { files },
  });
};

const imagesPopulate = (data: string[][]) => {
  return new Promise((resolve, reject) => {
    const result: imgData[] = [];
    try {
      data.map(async (item, i, array) => {
        if (item.length > 0) {
          const [userId, image] = item;
          const user = await User.findById(userId);
          const name = String(user?.name);

          result.push({ id: userId, name, userId, image });

          if (i === array.length - 1) {
            resolve(result);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const searchImages = (pattern: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    glob(pattern, (error: any, files: any[]) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(
        files.map((file: string) => {
          return file
            .substring(pattern.length - 4)
            .split("/")
            .filter((_v: any, _i: any, a: string | any[]) => a.length > 1);
        })
      );
    });
  });
};

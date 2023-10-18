import { Request as Req, Response as Resp } from "express";
import { glob } from "glob";
import path from "path";
import fs from "fs";
import { User } from "../models";
import { jwtParse } from "../helpers/jwt";
import { delFilesOnDir } from "../helpers/delFilesOnDir";

interface imgData {
  id: string;
  name: string;
  userId: string;
  image: string;
}

export const uploadProfileImage = async (req: Req, res: Resp) => {
  const { fullFileName } = req.params;
  const token = req.headers["x-token"];
  const { uid } = jwtParse(token);

  let user;
  let oldProfilePicture;

  try {
    user = await User.findById(uid);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (user) {
    oldProfilePicture = user.pictures.profile;
  }

  try {
    user = await User.findByIdAndUpdate(
      { _id: uid },
      {
        "pictures.profile": fullFileName,
      },
      {
        new: true,
        strict: false,
      }
    );
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  const dir = path.join(__dirname, `../../uploads/images/${uid}`);

  delFilesOnDir(dir, oldProfilePicture);

  return res.status(200).json({
    ok: true,
    msg: "Successfully uploaded Image Profile",
    result: { user },
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

import { Request as Req, Response as Resp } from "express";
import { glob } from "glob";
import path from "path";
import { sendEmail } from "../helpers";
import { User } from "../models";
const fs = require("fs").promises;

interface imgData {
  id: string;
  name: string;
  userId: string;
  image: string;
}

export const uploadImage = async (_req: Req, res: Resp) => {
  res.status(200).json({
    ok: true,
    msg: "Successfully uploaded files",
  });
};

export const getImage = async (req: Req, res: Resp) => {
  const { img, userId } = req.params;

  const url = path.join(__dirname, `../../uploads/images/${userId}/${img}`);
  res.sendFile(url);
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

export const deleteImage = async (req: Req, res: Resp) => {
  const { img, userId } = req.params;
  sendEmail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Enviado cuando se borra</b>", // html body
  }).catch(console.error);

  fs.unlink(path.join(__dirname, `../../uploads/images/${userId}/${img}`))
    .then(() => {
      res.status(200).json({
        ok: true,
        msg: "Successfully image delete",
        result: {},
      });
    })
    .catch((error: any) => {
      console.log(error);
    });
};

import mongoose from "mongoose";
import path from "path";

export const uploadFiles = (files: any, uid: string) => {
  return new Promise((resolve, reject) => {
    const { fileName } = files;

    console.log({ fileName });
    const splitedName = fileName.name.split(".");
    const extension = splitedName[splitedName.length - 1];

    try {
      const name = new mongoose.Types.ObjectId();
      const tempName = `${name}.${extension}`;

      const uploadPath = path.join(
        __dirname,
        `../../uploads/images/${uid}/${tempName}`
      );

      fileName.mv(uploadPath, (err: any) => {
        if (err) {
          reject(err);
        }

        resolve(tempName);
      });
    } catch (error) {
      console.log(error);
      reject({
        ok: false,
        msg: "failed something",
        result: { error },
      });
    }
  });
};

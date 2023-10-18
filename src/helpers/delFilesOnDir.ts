import fs from "fs";
import path from "path";

export const delFilesOnDir = (dir: string, fileTarget: string) => {
  const images: string[] = fs.readdirSync(dir);

  images.forEach((image) => {
    const pathImage = path.join(dir, image);

    if (fs.statSync(pathImage).isDirectory()) {
      delFilesOnDir(pathImage, fileTarget);
    } else {
      if (image === fileTarget) {
        fs.unlinkSync(pathImage);
      }
    }
  });
};

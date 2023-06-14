import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { uploadFiles } from "../helpers";
import { User } from "../models";
import { getUserData } from "../helpers/jwt";

export const fileUpload = async (req: Request, res: Response) => {
  try {
    // txt, md
    // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
    const { userId } = getUserData(req);
    const name = await uploadFiles(req.files, userId);

    res.json({
      ok: true,
      msg: "The image was upload",
      result: { name },
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Please talk to administrator",
      result: { error },
    });
  }
};

export const updateImage = async (req: Request, res: Response) => {
  const { id, colection } = req.params;

  let model;

  switch (colection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no user with the id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({
        ok: false,
        msg: "I forgot to validate this",
        result: {},
      });
  }

  // Limpiar imágenes previas
  if (model.img) {
    // Hay que borrar la imagen del servidor
    const imagePath = path.join(__dirname, "../uploads", colection, model.img);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const name = await uploadFiles(req.files, colection);
  model.img = name;

  await model.save();

  return res.json(model);
};

export const showImage = async (req: Request, res: Response) => {
  const { id, colection } = req.params;

  let model;

  switch (colection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no user with the id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "I forgot to validate this" });
  }

  // Limpiar imágenes previas
  if (model.img) {
    // Hay que borrar la imagen del servidor
    const imagePath = path.join(__dirname, "../uploads", colection, model.img);
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const imagePath = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(imagePath);
};

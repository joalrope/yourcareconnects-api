import { Request, Response } from "express";

import { /* IModality,*/ Modality } from "../models/index";

export const getModalities = async (_req: Request, res: Response) => {
  //

  try {
    const [total, modalities] = await Promise.all([
      Modality.countDocuments(),
      //Modality.find().skip(Number(from)).limit(Number(limit)),
      Modality.find(),
    ]);

    return res.status(200).json({
      ok: true,
      msg: "The list of modalities was successfully obtained",
      result: {
        total,
        modalities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const getModality = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ModalityDB = await Modality.findById(id);

    if (ModalityDB) {
      if (ModalityDB.isActive) {
        return res.status(200).json({
          ok: true,
          msg: `The user with id: ${id} was successfully obtained`,
          result: ModalityDB,
        });
      }

      return res.status(200).json({
        ok: false,
        msg: `The user with id: ${id} is inactive`,
        result: ModalityDB,
        statuscode: 409,
      });
    }

    return res.status(409).json({
      ok: false,
      msg: `The user with id: ${id} is inactive`,
      result: ModalityDB,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const createModality = async (req: Request, res: Response) => {
  const { title, color } = req.body;

  try {
    let ModalityDB = await Modality.findOne({ title }, { new: true });

    if (ModalityDB) {
      return res.status(201).json({
        ok: false,
        msg: `There is already a service with the title ${title}`,
        result: {},
      });
    }

    const modality = new Modality({
      title,
      tagColor: color,
    });

    // Guardar en BD
    await modality.save();

    return res.status(201).json({
      ok: true,
      msg: "Modality created successfully",
      result: modality,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const updateModality = async (req: Request, res: Response) => {
  let { id, title, tagColor } = req.body;

  if (!tagColor) {
    const modalityDB = await Modality.findById(id);
    tagColor = modalityDB.tagColor;
  }

  try {
    const updatedModality = await Modality.findOneAndUpdate(
      { _id: id },
      { title, tagColor },
      { new: true }
    );

    if (updatedModality) {
      return res.status(200).json({
        ok: true,
        msg: "Modality updated successfully",
        result: updatedModality,
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
  return res.status(409).json({
    ok: false,
    msg: "Modality failed to be updated",
    result: {},
  });
};

export const deleteModality = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await Modality.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    return res.status(204).json({
      ok: true,
      msg: "Modality deleted successfully",
      result: user,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

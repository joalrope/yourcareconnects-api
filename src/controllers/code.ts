import { Request, Response } from "express";

import { Code } from "../models";

export const getCodes = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = {};

  try {
    const [total, codes] = await Promise.all([
      Code.countDocuments(query),
      Code.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    return res.status(200).json({
      ok: true,
      msg: "The list of activation codes was successfully obtained",
      result: {
        total,
        codes,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: {},
    });
  }
};

export const getCode = async (req: Request, res: Response) => {
  const { code } = req.params;

  let codeDB;

  try {
    codeDB = await Code.findOne({ code });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (!codeDB) {
    return res.status(409).json({
      ok: false,
      msg: `The code: ${code} does not exist`,
      result: codeDB,
    });
  }

  if (codeDB.isActive === false) {
    return res.status(200).json({
      ok: false,
      msg: `The code: ${code} has already been used`,
      result: codeDB,
    });
  }

  return res.status(200).json({
    ok: true,
    msg: `The code: ${code} was successfully obtained`,
    result: codeDB,
  });
};

export const createCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  let codeDB;

  try {
    codeDB = await Code.findOne({ code });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: error,
    });
  }

  if (codeDB) {
    return res.status(409).json({
      ok: false,
      msg: `There is already a code: ${codeDB.code}`,
      result: {},
    });
  }

  const newCode = new Code({ code, email });

  // Guardar en BD
  await newCode.save();

  return res.status(201).json({
    ok: true,
    msg: "Code created successfully",
    result: {
      newCode,
    },
  });
};

export const inactivateCode = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const codeDB = await Code.findOneAndUpdate(
      { code },
      { isActive: false },
      { new: true }
    );

    return res.status(204).json({
      ok: true,
      msg: "Code was successfully inactivated",
      result: codeDB,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: {},
    });
  }
};

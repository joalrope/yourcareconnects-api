import { Request, Response } from "express";

export const geti18n = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      ok: true,
      msg: "The list of users was successfully obtained",
      result: {},
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

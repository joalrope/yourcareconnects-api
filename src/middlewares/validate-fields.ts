import { Request, Response, NextFunction } from "express";
const { validationResult } = require("express-validator");

export const validateFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({
      ok: false,
      statuscode: 409,
      msg: errors.errors[0].msg,
      result: { errors },
    });
  }
  next();
  return;
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models/user";

interface ITokenPayload {
  uid: string;
  email: string;
  role: string;
}

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
      result: {},
    });
  }

  try {
    const decoded = jwt.verify(token, String(process.env.SECRET_KEY));

    const { uid } = decoded as ITokenPayload;

    // leer el usuario que corresponde al uid
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe DB",
      });
    }

    // Verificar si el uid tiene estado true
    if (!user.isActive) {
      return res.status(401).json({
        msg: "Invalid token - user status: false",
      });
    }

    next();
    return;
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

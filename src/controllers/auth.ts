import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { User } from "../models";
import { generateJWT } from "../helpers/jwt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        ok: false,
        statuscode: 400,
        msg: "User / Password are not correct",
        result: {},
      });
    }

    // SI el usuario está activo
    if (!user.isActive) {
      res.status(400).json({
        ok: false,
        msg: "User / Password are not correct - status: false",
        result: {},
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(200).send({
        ok: false,
        statuscode: 400,
        msg: "User / Password are not correct - status: false",
        result: {},
      });
    }

    // Generar el JWT
    const token = await generateJWT(user.id, user.email, user.role);

    return res.status(200).json({
      ok: true,
      msg: "Login successful",
      result: {
        user,
        token,
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

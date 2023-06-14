import { Request } from "express";
import jwt from "jsonwebtoken";

export const generateJWT = (uid: string, email: string, role: string) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, email, role };

    jwt.sign(
      payload,
      String(process.env.SECRET_KEY),
      {
        expiresIn: "7d",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const jwtParse = (token: any) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  const buff = Buffer.from(base64, "base64");
  const { uid, role } = JSON.parse(buff.toString("utf-8"));

  return { uid, role };
};

export const getUserData = (req: Request) => {
  const token = req.header("authorization")?.replace("Bearer ", "");

  if (!token) {
    return { userId: "", role: "" };
  }

  const { uid, role } = jwtParse(token);

  return { userId: uid, role };
};

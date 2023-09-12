import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { User } from "../models";
import { generateJWT } from "../helpers/jwt";
import { sendEmail } from "../helpers";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const mailOptions = {
      from: "jrodriguez@bohiques.com",
      to: "joalrope@gmail.com",
      subject: "Hello from Node.js app!",
      generateTextFromHTML: true,
      html: `<h1>Hello world! Envio de correo desde Node.js</h1>
      <div style="background-color:black;border-radius: 10px; padding: 20px; text-align: center; width: 220px" >
        <img src="https://yourcareconnects.com/wp-content/uploads/2023/08/cropped-your-care-connects-logo-letras-blancas-02-1024x501.png" alt="yourcareconnects logo" width="200px"/>
      </div>
      <div>http://yourcareconnects.com/</div>
      `,
    };

    await sendEmail(mailOptions);

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
    if (user.isDeleted) {
      res.status(200).json({
        ok: false,
        statuscode: 400,
        msg: "User dont't exist - status: false",
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

import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import { User } from "../models/index";
import { generateJWT } from "../helpers";

export const getUsers = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { isActive: true };

  try {
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    return res.status(200).json({
      ok: true,
      msg: "The list of users was successfully obtained",
      result: {
        total,
        users,
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

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userDB = await User.findById(id);

    if (userDB) {
      if (userDB.isActive) {
        return res.status(200).json({
          ok: true,
          msg: `The user with id: ${id} was successfully obtained`,
          result: userDB,
        });
      }

      return res.status(200).json({
        ok: false,
        msg: `The user with id: ${id} is inactive`,
        result: userDB,
        statuscode: 409,
      });
    }

    return res.status(409).json({
      ok: false,
      msg: `The user with id: ${id} is inactive`,
      result: userDB,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, ...restData } = req.body;

  console.log("====== create user ======");

  try {
    let userDB = await User.findOne({ email });

    console.log(userDB);

    if (userDB) {
      return res.status(201).json({
        ok: false,
        msg: `There is already a user with the email ${email}`,
        result: {},
      });
    }

    const user = new User({ email, password, ...restData });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    // Generar el JWT
    const token = await generateJWT(user.id, user.email, user.role);

    return res.status(201).json({
      ok: true,
      msg: "User created successfully",
      result: {
        token,
        user,
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

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    company,
    owner,
    address,
    zipcode,
    phonenumber,
    faxnumber,
    webUrl,
    certificates,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          company,
          owner,
          address,
          zipcode,
          phonenumber,
          faxnumber,
          webUrl,
        },
        $addToSet: { certificates },
      },
      {
        new: true,
        strict: false,
      }
    );
    console.log({ user });

    if (user) {
      return res.status(200).json({
        ok: true,
        msg: "User updated successfully",
        result: user,
      });
    }
    return;
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return res.status(204).json({
      ok: true,
      msg: "User deleted successfully",
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

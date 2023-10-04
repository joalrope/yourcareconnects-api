import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import { IUser, User } from "../models/index";
import { generateJWT } from "../helpers";
import { IResponse, returnErrorStatus } from ".";

export const getUsers = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;

  let total: number = 0;
  let users: IUser[] = [];
  let response: IResponse;

  try {
    [total, users] = await Promise.all([
      User.countDocuments(),
      User.find().skip(Number(from)).limit(Number(limit)),
    ]);
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (total > 0 && users.length > 0) {
    response = {
      ok: true,
      msg: "The list of users was successfully obtained",
      result: {
        total: total,
        user: users,
      },
    };

    return res.status(200).json(response);
  }

  response = {
    ok: false,
    msg: "Sorry, there are no users to show",
    result: {},
  };

  return res.status(200).json(response);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  let userDB: IUser;
  let response: IResponse;

  try {
    userDB = await User.findById(id);
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (userDB!) {
    response = {
      ok: true,
      msg: `The user with id: ${id} was successfully obtained`,
      result: userDB,
    };
    return res.status(200).json(response);
  }

  response = {
    ok: false,
    msg: `The user with id: ${id} is inactive`,
    result: userDB!,
  };

  return res.status(409).json(response);
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, picture, address, ...restData } = req.body;

  let user: IUser;
  let userDB: IUser;
  let response: IResponse;

  const complement = {
    address: "",
    faxNumber: "",
    owner: "",
    picture: "",
    services: [],
    serviceModality: [],
    certificates: [],
    webUrl: "",
    zipCode: "",
  };

  try {
    userDB = await User.findOne({ email });
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (userDB!) {
    response = {
      ok: false,
      msg: `There is already a user with the email: ${email}`,
      result: {},
    };

    return res.status(409).json(response);
  }

  try {
    user = new User({ email, password, ...restData, ...complement });
  } catch (error) {
    returnErrorStatus(error, res);
  }

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user!.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  try {
    await user!.save();
  } catch (error) {
    returnErrorStatus(error, res);
  }

  // Generar el JWT
  const token = await generateJWT(user!.id, user!.email, user!.role);

  response = {
    ok: true,
    msg: "User created successfully",
    result: {
      token,
      user: user!,
    },
  };

  return res.status(201).json(response);
};

export const getUsersByServices = async (req: Request, res: Response) => {
  let services = req.query.services as string[];
  let response: IResponse;
  let users: IUser[];

  try {
    users = await User.find({
      services: {
        $in: [...services],
      },
    });
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (users!.length > 0) {
    response = {
      ok: true,
      msg: "The list of users was successfully obtained",
      result: {
        users: users!,
      },
    };

    return res.status(200).json(response);
  }

  response = {
    ok: false,
    msg: "Sorry, there are no users to show",
    result: {},
  };

  return res.status(409).json(response);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    company,
    owner,
    address,
    zipCode,
    phoneNumber,
    faxNumber,
    webUrl,
    services,
    serviceModality,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          company,
          owner,
          address,
          zipCode,
          phoneNumber,
          faxNumber,
          webUrl,
        },
        $addToSet: {
          services: [...services],
          serviceModality: [...serviceModality],
        },
      },
      {
        new: true,
        strict: false,
      }
    );

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

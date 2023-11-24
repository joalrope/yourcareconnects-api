import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { IUser, User } from "../models/index";
import { generateJWT } from "../helpers";
import { IResponse, returnErrorStatus } from ".";
import { IMessage } from "../models/user";

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

export const getUserMessages = async (req: Request, res: Response) => {
  const { id, channel } = req.params;

  const myKey = `id${channel}`;

  let messages: { [key: string]: IMessage[] } = {};

  const messagesDB = await User.findOne(
    {
      _id: id,
      [`messages.${myKey}`]: { $exists: true },
    },
    { messages: 1 }
  );

  if (messagesDB.messages) {
    messages = {
      [myKey]: messagesDB.messages[myKey],
    };
  }

  res.status(200).json({
    ok: true,
    msg: "The messages were successfully obtained",
    result: {
      messages,
    },
  });
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
      role: "provider",
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
    address,
    biography,
    company,
    faxNumber,
    location,
    messages,
    owner,
    phoneNumber,
    services,
    serviceModality,
    webUrl,
    zipCode,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        address,
        biography,
        company,
        faxNumber,
        location,
        messages,
        owner,
        phoneNumber,
        services,
        serviceModality,
        webUrl,
        zipCode,
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
        result: { user },
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

export const updateUserContacts = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { contact } = req.body;

  let user;

  try {
    user = await User.find({
      id,
      contacts: {
        $in: [contact],
      },
    });

    if (user.length > 0) {
      return res.status(409).json({
        ok: false,
        msg: `The contact ${contact} already exists in the list of contacts`,
        result: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (user.length === 0) {
    let user;

    try {
      user = await User.findByIdAndUpdate(
        { _id: id },
        {
          $push: { contacts: contact },
        },
        {
          new: true,
          strict: false,
        }
      );

      return res.status(200).json({
        ok: true,
        msg: "The contact has been added successfully",
        result: {
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
  }
  return res.status(409).json({
    ok: false,
    msg: "The contact cannot be added",
    result: {},
  });
};

export const updateUserMessages = async (
  id: string,
  channel: string,
  messages: IMessage /*req: Request, res: Response*/
) => {
  //const { id } = req.params;
  //const { channel, messages } = req.body;

  try {
    const myKey = `id${channel}`;

    await User.findOneAndUpdate(
      { _id: id },
      { $push: { [`messages.${myKey}`]: messages } }
    );

    return true;

    /*  return res.status(200).json({
      ok: true,
      msg: "The message has been added successfully",
      result: {
        user,
      },
    }); */
  } catch (error) {
    return false;
    /* return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    }); */
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

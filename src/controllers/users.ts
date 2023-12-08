import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { IUser, User } from "../models/index";
import { generateJWT } from "../helpers";
import { IResponse, returnErrorStatus } from "../controllers";
import { IMessage } from "../models/user";
import { randomLocation } from "../helpers/randomLocation";

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

export const getUsersByIsActive = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;
  const { typeUser } = req.params;
  let query = {};

  if (typeUser === "active") {
    query = { isActive: true, isDeleted: false };
  } else if (typeUser === "inactive") {
    query = { isActive: false, isDeleted: false };
  } else {
    query = { isDeleted: false };
  }

  let total: number = 0;
  let users: IUser[] = [];
  let response: IResponse;

  try {
    [total, users] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      User.find(query, {
        email: 1,
        names: 1,
        lastName: 1,
        phoneNumber: 1,
        isActive: 1,
      })
        .skip(Number(from))
        .limit(Number(limit)),
    ]);
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (total > 0 && users.length > 0) {
    response = {
      ok: true,
      msg: "The list of inactive users was successfully obtained",
      result: {
        total: total,
        users: users,
      },
    };

    return res.status(200).json(response);
  }

  response = {
    ok: false,
    msg: "Sorry, there are no inactive users to show",
    result: {},
  };
  return res.status(200).json(response);
};

export const getUserMessages = async (req: Request, res: Response) => {
  const { id, channel } = req.params;

  const myKey = `id${channel}`;

  // let messages: { [key: string]: IMessage[] } = {};

  const messagesDB = await User.findOne(
    {
      _id: id,
      [`messages.${myKey}`]: { $exists: true },
    },
    { _id: 0, messages: 1 }
  );

  if (messagesDB !== null) {
    const messages = messagesDB.messages[myKey];

    res.status(200).json({
      ok: true,
      msg: "The messages were successfully obtained",
      result: {
        messages,
      },
    });

    return;
  }

  res.status(409).json({
    ok: false,
    msg: "There is not messages yet",
    result: {
      messages: [],
    },
  });
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, ...restData } = req.body;

  let user!: IUser;
  let userDB!: IUser;
  let response!: IResponse;

  const complement = {
    address: "",
    biography: "",
    faxNumber: "",
    location: {
      type: "Point",
      coordinates: [randomLocation("lng"), randomLocation("lat")],
    },
    messages: { idchatbot: { messages: [] } },
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

  if (userDB) {
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

  // Generar el JWT
  const token = await generateJWT(user.id, user.email, user.role);

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  try {
    await user.save();
  } catch (error) {
    returnErrorStatus(error, res);
  }

  response = {
    ok: true,
    msg: "User created successfully",
    result: {
      token,
      user: user,
    },
  };
  res.status(201).json(response);

  return;
};

export const getUsersByServices = async (req: Request, res: Response) => {
  const { rng, lat, lng } = req.params;
  let services = req.query.services as string[];
  let response: IResponse;
  let users!: IUser[];

  try {
    users = await User.find({
      role: "provider",
      services: {
        $in: [...services],
      },
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $minDistance: 0,
          $maxDistance: parseFloat(rng) * 1600,
        },
      },
    });
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (users!?.length > 0) {
    response = {
      ok: true,
      msg: "The list of users was successfully obtained",
      result: {
        users,
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

  let user!: IUser;

  const {
    address,
    biography,
    company,
    faxNumber,
    location,
    messages,
    owner,
    phoneNumber,
    pictures,
    services,
    serviceModality,
    webUrl,
    zipCode,
  } = req.body;

  let coordinates!: number[];

  const preData = {
    address,
    biography,
    company,
    faxNumber,
    messages,
    owner,
    phoneNumber,
    services,
    serviceModality,
    webUrl,
    zipCode,
  };

  let dataLocation!: { type: string; coordinates: number[] };
  let dataPictures!: object;

  if (location) {
    ({ coordinates } = location);

    dataLocation = {
      type: "Point",
      coordinates: [coordinates[0], coordinates[1]],
    };
  }

  console.log({ pictures });

  if (pictures) {
    dataPictures = {
      profile: { ...pictures },
    };
  }

  console.log({ dataLocation });
  console.log({ dataPictures });

  const data = {
    $set: {
      ...preData,
      location: { ...dataLocation },
      pictures: dataPictures,
    },
  };

  console.log({ data });

  try {
    user = await User.findByIdAndUpdate({ _id: id }, data, {
      new: true,
      strict: false,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (!user) {
    return res.status(409).json({
      ok: false,
      msg: "User cannot be updated",
      result: {},
    });
  }

  return res.status(200).json({
    ok: true,
    msg: "User updated successfully",
    result: { user },
  });
};

export const incrementUserNotifications = async (
  id: string,
  receiverId: string
) => {
  try {
    const notifications = await User.findByIdAndUpdate(
      { _id: receiverId },
      { $inc: { [`notifications.id${id}`]: 1 } },
      { new: true }
    );

    return notifications;
  } catch (error) {
    return false;
  }
};

export const clearUserNotifications = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.params;

  let user;

  try {
    user = await User.findByIdAndUpdate(
      { _id: senderId, [`notifications.id${receiverId}`]: { $exists: true } },
      { $unset: { [`notifications.id${receiverId}`]: 1 } },
      {
        new: true,
        strict: false,
      }
    );
  } catch (error) {
    return returnErrorStatus(error, res);
  }

  if (user) {
    return res.status(200).json({
      ok: true,
      msg: "User notifications cleared successfully",
      result: { user },
    });
  }

  return res.status(404).json({
    ok: false,
    msg: "Please talk to the administrator",
    result: {},
  });
};

export const updateUserContacts = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { contact } = req.body;

  let user: IUser[];

  try {
    user = await User.find({
      id,
      contacts: {
        $in: [contact],
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (user.length > 0) {
    return res.status(409).json({
      ok: false,
      msg: `The contact ${contact} already exists in the list of contacts`,
      result: {},
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
  try {
    const myKey = `id${channel}`;

    await User.findOneAndUpdate(
      { _id: id },
      { $push: { [`messages.${myKey}`]: messages } }
    );

    return true;
  } catch (error) {
    return false;
  }
};

export const changeActiveUserStatus = async (req: Request, res: Response) => {
  const { id, value } = req.params;

  let user: IUser = {} as IUser;

  try {
    user = await User.findOneAndUpdate(
      { _id: id },
      { isActive: JSON.parse(value) },
      {
        new: true,
        strict: false,
      }
    );
  } catch (error) {
    return returnErrorStatus(error, res);
  }

  return res.status(200).json({
    ok: true,
    msg: "User updated successfully",
    result: {
      user,
    },
  });
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

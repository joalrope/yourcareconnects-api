import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { IUser, User } from "../models/index";
import { generateJWT, sendEmail } from "../helpers";
import { IResponse, returnErrorStatus } from "../controllers";
import { IMessage } from "../models/user";
import { logger } from "../helpers/logger";

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
    returnErrorStatus(error, res, "Error getting users");
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
    returnErrorStatus(error, res, "Error getting user");
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

export const thereIsSupport = async (_req: Request, res: Response) => {
  const user = await User.findOne({ role: "owner" });

  const result = user ? true : false;

  const response = {
    ok: result,
    msg: `There is ${result ? "a" : "no"} a support`,
    result: { result },
  };
  return res.status(200).json(response);
};

export const getUsersByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  const user = await User.findOne(
    { email },
    {
      names: 1,
      emai: 1,
      lastName: 1,
      _id: 1,
      role: 1,
      phoneNumbrer: 1,
      location: 1,
      isAllowedViewData: 1,
      isActive: 1,
      isdeleted: 1,
      pictures: 1,
      ratings: 1,
      services: 1,
    }
  );

  const response = {
    ok: true,
    msg: `The user with email: ${email} was successfully obtained`,
    result: { users: [user] },
  };
  return res.status(200).json(response);
};

export const getUsersByIsActive = async (req: Request, res: Response) => {
  const { limit = 50, from = 0 } = req.query;
  const { typeUser } = req.params;
  let query = {};

  if (typeUser === "active") {
    query = {
      isActive: true,
      isDeleted: false,
      role: "provider",
    };
  } else if (typeUser === "inactive") {
    query = {
      isActive: false,
      isDeleted: false,
      role: "provider",
    };
  } else if (typeUser === "deleted") {
    query = { isDeleted: true, role: "provider" };
  } else {
    query = { isDeleted: false, role: { $in: ["provider", "customer"] } };
  }

  let total: number = 0;
  let users: IUser[] = [];
  let response: IResponse;

  try {
    [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query, {
        email: 1,
        names: 1,
        lastName: 1,
        role: 1,
        phoneNumber: 1,
        pictures: 1,
        services: 1,
        ratings: 1,
        isAllowedViewData: 1,
        isActive: 1,
        isDeleted: 1,
      })
        .skip(Number(from))
        .limit(Number(limit)),
    ]);
  } catch (error) {
    returnErrorStatus(error, res, "Error getting users");
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

    //TODO: Group by date

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
  let { email, password, code, role, ...restData } = req.body;

  const codeAssignment = process.env.MASTER_CODES;
  const wpUsername = process.env.WP_USERNAME;
  const wpPassword = process.env.WP_PASSWORD;
  const wpUrl = `${process.env.WP_URL}/${code}`;

  let user!: IUser;
  let response!: IResponse;
  let wpResponse;
  let midResponse;

  const codeAssignmentSplited = String(codeAssignment).split("|");
  const ownerCode = String(codeAssignmentSplited[0]);
  const developerCode = String(codeAssignmentSplited[1]);
  const superadminCode = String(codeAssignmentSplited[2]);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    user = await User.findOne({ email });
  } catch (error) {
    returnErrorStatus(error, res, "Error creating user, check your email");
  }

  if (user) {
    response = {
      ok: false,
      msg: `There is already a user with the email: {{email}}`,
      result: { email, message: "Email already in use" },
    };

    return res.status(200).json(response);
  }

  if (code === ownerCode) {
    role = "owner";
  } else if (code === developerCode) {
    role = "developer";
  } else if (code === superadminCode) {
    role = "superadmin";
  }

  if (role === "provider") {
    const codeDB = await User.findOne(
      { "subscription.code": code },
      {
        names: 1,
        lastName: 1,
        email: 1,
        subscription: 1,
      }
    );

    if (codeDB) {
      logger.info(`The code: ${code} has already been used`);
      return res.status(200).json({
        ok: false,
        msg: `The code: {{code}} has already been used`,
        result: {
          code,
          subsDate: codeDB.subscription.subsDate,
          message: "code already in use",
        },
      });
    }

    try {
      midResponse = await fetch(wpUrl, {
        method: "GET",
        headers: new Headers({
          Authorization: "Basic " + btoa(`${wpUsername}:${wpPassword}`),
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        signal: controller.signal,
      });
    } catch (error) {
      return res.status(200).json({
        ok: false,
        msg: "Error getting code from Wordpress",
        result: { error, message: "Error getting code from WP" },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (midResponse.ok) {
      try {
        wpResponse = await midResponse.json();
      } catch (error) {
        return res.status(500).json({
          ok: false,
          msg: "Please talk to the administrator",
          result: { error, message: "Error getting code from WP" },
        });
      }
    } else {
      return res.status(200).json({
        ok: false,
        msg: `The code: ${code} does not exist`,
        result: {
          wpResponse,
        },
      });
    }

    if (!wpResponse.id) {
      return res.status(200).json({
        ok: false,
        msg: `The code: {{code}} does not exist`,
        result: {
          code: wpResponse.id,
          subsDate: "",
          message: "code does not exist",
        },
      });
    }
  } else {
    wpResponse = {
      id: "",
      date_created: Date.now(),
    };
  }

  const complement = {
    address: "",
    biography: "",
    faxNumber: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    contacts: [],
    messages: { idchatbot: { messages: [] } },
    owner: "",
    picture: "",
    services: [],
    serviceModality: [],
    subscription: {
      code: wpResponse.id,
      subsDate: wpResponse.date_created,
    },
    certificates: [],
    webUrl: "",
    zipCode: "",
  };

  try {
    user = new User({ email, password, role, ...restData, ...complement });
  } catch (error) {
    returnErrorStatus(error, res, "Error new user");
  }

  const token = await generateJWT(user.id, user.email, user.role);

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  try {
    await user.save();
  } catch (error) {
    returnErrorStatus(error, res, "Error saving new user");
  }

  if (user.role === "provider" || user.role === "customer") {
    const mailOptions = {
      from: `${process.env.EMAIL_ADDRESS}`,
      to: "drivera@yourcareconnects.com",
      subject: "yourcareconnects - New Provider",
      generateTextFromHTML: true,
      html: `
      <h2 style="margin:0px;">New Provider</h1>
      <br />
      <p style="margin:0px;">A new ${user.role} has registered</p>
      <p>${
        user.role === "provider" &&
        "Please review and make the respective approval or rejection in the dashboard"
      } </p>
      <div style="margin: 64px;text-align: center">
      <h3>User Data</h2>
      <h5>Names: ${`${user.names}`}</h5>
      <h5>Lasname: ${`${user.lastName}`}</h5>
      <h5>email: ${`${user.email}`}</h5>
      <h5>User type: ${`${user.role}`}</h5>
      </div>
      `,
    };

    await sendEmail(mailOptions);
  }

  response = {
    ok: true,
    msg: "User created successfully",
    result: {
      token,
      user: user,
      message: "User created successfully",
    },
  };

  logger.info(`User created successfully: ${user.email}`);
  return res.status(201).json(response);
};

export const getUsersByServices = async (req: Request, res: Response) => {
  const { rng, lat, lng } = req.params;
  let services = req.query.services as string[];
  let response: IResponse;
  let users!: IUser[];

  try {
    users = await User.find({
      role: { $ne: "customer" },
      isDeleted: false,
      isActive: true,
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
    returnErrorStatus(error, res, "Error getting users by services");
  }

  if (users.length > 0) {
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
  const { location, pictures, ...restData } = req.body;
  let user!: IUser;

  if (location) {
    const { coordinates } = location;

    restData.location = {
      type: "Point",
      coordinates: [coordinates[0], coordinates[1]],
    };
  }

  if (pictures) {
    restData.pictures = {
      ...pictures,
    };
  }

  const data = {
    $set: {
      ...restData,
    },
  };

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
    return returnErrorStatus(error, res, "Error clearing user notifications");
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
  const { contact }: { contact: string } = req.body;
  const addContact = req.query.hasOwnProperty("add")
    ? true
    : req.query.hasOwnProperty("remove")
    ? false
    : null;

  let user;

  const method = addContact
    ? {
        $push: { contacts: contact },
      }
    : {
        $pull: { contacts: contact },
      };

  const msg = addContact
    ? "The contact has been added successfully"
    : "The contact has been deleted successfully";

  try {
    user = await User.findByIdAndUpdate({ _id: id }, method, {
      new: true,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  return res.status(200).json({
    ok: true,
    msg,
    result: { user },
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

export const setUserLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { location } = req.body;

  const data = {
    $set: {
      location,
    },
  };

  try {
    await User.findByIdAndUpdate({ _id: id }, data, {
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

  return res.status(200).json({
    ok: true,
    msg: "Location updated successfully",
    result: { location },
  });
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
    return returnErrorStatus(error, res, "Error changing user status");
  }

  return res.status(200).json({
    ok: true,
    msg: "User updated successfully",
    result: {
      user,
    },
  });
};

export const changeValueUserRatings = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ratings } = req.body;

  try {
    await User.findByIdAndUpdate(
      { _id: id },
      {
        $push: { ratings },
      },
      { new: true, strict: false }
    );
  } catch (error) {
    return returnErrorStatus(error, res, "Error changing user ratings");
  }

  return res.status(200).json({
    ok: true,
    msg: "Your rating has been successfully updated",
    result: {
      ratings,
    },
  });
};

export const changeUserRole = async (req: Request, res: Response) => {
  const { id, value } = req.params;

  let user: IUser = {} as IUser;

  try {
    user = await User.findOneAndUpdate(
      { _id: id },
      { role: value },
      {
        new: true,
        strict: false,
      }
    );
  } catch (error) {
    return returnErrorStatus(error, res, "Error changing user role");
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
  const role = req.headers["x-role"];

  if (role === "customer" || role === "provider") {
    return res.status(401).json({
      ok: false,
      msg: "Unauthorized",
      result: {},
    });
  }

  let user: IUser = {} as IUser;

  try {
    user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (!user) {
    return res.status(404).json({
      ok: false,
      msg: "User not found",
      result: {},
    });
  }

  return res.status(200).json({
    ok: true,
    msg: "User deleted successfully",
    result: { user },
  });
};

export const restoreUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const role = req.headers["x-role"];

  if (role === "customer" || role === "provider") {
    return res.status(401).json({
      ok: false,
      msg: "Unauthorized",
      result: {},
    });
  }

  let user: IUser = {} as IUser;

  try {
    user = await User.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (!user) {
    return res.status(404).json({
      ok: false,
      msg: "User not found",
      result: {},
    });
  }

  return res.status(200).json({
    ok: true,
    msg: "User restored successfully",
    result: { user },
  });
};

export const changeDeletedUserStatus = async (req: Request, res: Response) => {
  const { id, value } = req.params;
  const role = req.headers["x-role"];

  if (role === "customer" || role === "provider") {
    return res.status(401).json({
      ok: false,
      msg: "Unauthorized",
      result: {},
    });
  }

  let user: IUser = {} as IUser;

  try {
    user = await User.findByIdAndUpdate(
      id,
      { $set: { isDeleted: JSON.parse(value) } },
      { new: true }
    );
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (!user) {
    return res.status(404).json({
      ok: false,
      msg: "User not found",
      result: {},
    });
  }

  return res.status(200).json({
    ok: true,
    msg: "User deleted successfully",
    result: { user },
  });
};

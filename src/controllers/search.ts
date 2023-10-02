import { Request, Response } from "express";
import mongoose from "mongoose";

import { IUser, User, Service } from "../models";
import { returnErrorStatus } from ".";
import { IService } from "../models/service";
import { isValidObjectId } from "../helpers/mongo-util";

const collectionsAllowed = ["users", "services"];

export const searchUser = async (id = "", res: Response) => {
  const isMongoID = isValidObjectId(id); // TRUE

  let user: IUser = {} as IUser & mongoose.Document;
  let users: IUser[] = [];

  if (isMongoID) {
    try {
      user = await User.findById(id);
    } catch (error) {
      returnErrorStatus(error, res);
    }

    if (!user!) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
        result: {},
      });
    }

    return res.json({
      ok: true,
      msg: "The user was successfully obtained",
      results: user,
    });
  }

  const regex = new RegExp(id, "i");

  try {
    users = await User.find({
      $or: [
        { names: regex },
        { email: regex },
        {
          services: {
            $in: [regex],
          },
        },
      ],
    });
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (users!.length === 0) {
    return res.json({
      ok: false,
      msg: "There are no users to display",
      results: [],
    });
  }

  return res.status(200).json({
    ok: true,
    msg: "The list of users was successfully obtained",
    results: users!,
  });
};

export const searchService = async (id = "", res: Response) => {
  const isMongoID = isValidObjectId(id); // TRUE

  let service: IService = {} as IService & mongoose.Document;

  if (isMongoID) {
    try {
      service = await Service.findById(id);
    } catch (error) {
      returnErrorStatus(error, res);
    }

    return res.json({
      ok: true,
      msg: "The list of services was successfully obtained",
      results: service ? [service] : [],
    });
  }

  const regex = new RegExp(id, "i");
  const services = await Service.find({ name: regex, isActive: true });

  return res.json({
    results: services,
  });
};

export const search = (req: Request, res: Response) => {
  const { collection, id } = req.params;

  if (!collectionsAllowed.includes(collection)) {
    return res.status(400).json({
      msg: `The allowed collections are: ${collectionsAllowed}`,
    });
  }

  switch (collection) {
    case "users":
      searchUser(id, res);
      break;
    case "services":
      searchService(id, res);
      break;
    default:
      res.status(500).json({
        msg: `Collection ${collection} does not exist`,
      });
  }

  return;
};

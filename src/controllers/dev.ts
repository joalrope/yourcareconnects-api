import { Request, Response } from "express";
import { IUser } from "../models";

import { User } from "../models";

export const clearContacts = async (_req: Request, res: Response) => {
  //
  let users: IUser[] = [];

  try {
    users = await User.find({});
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error getting users",
      result: { error },
    });
  }

  users.map(async (user) => {
    const newContacts: string[] = [];

    user.contacts?.map((contact) => {
      if (!newContacts.includes(contact)) {
        if (user.role !== "owner") {
          newContacts.push(contact);
        }
      }
    });

    await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { contacts: newContacts } },
      {
        new: true,
        strict: false,
      }
    );
  });

  return res.status(200).json({
    ok: true,
    msg: `Contacts was successfully cleaned`,
    result: { users },
  });
};

export const userHardDelete = async (req: Request, res: Response) => {
  const email = req.params.email;

  const result = await User.deleteOne({ email }, { strict: false });

  res.status(200).json({
    ok: true,
    msg: `The user with email: ${email} was successfully deleted`,
    result: { result },
  });
};

export const ratingsNormalize = async (_req: Request, res: Response) => {
  const result = await User.updateMany({}, { $set: { ratings: [] } });

  res.status(200).json({
    ok: true,
    msg: `Ratings was successfully normalized`,
    result: { result },
  });
};

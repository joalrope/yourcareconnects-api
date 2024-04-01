import { Request, Response } from "express";

import { User } from "../models";

export const getCode = async (req: Request, res: Response) => {
  const { code } = req.params;
  const username = process.env.WP_USERNAME;
  const password = process.env.WP_PASSWORD;
  const url = `${process.env.WP_URL}/${code}`;

  let resp;

  const userDB = await User.findOne(
    { "subscription.code": code },
    {
      names: 1,
      lastName: 1,
      email: 1,
      subscription: 1,
    }
  );

  if (userDB) {
    return res.status(200).json({
      ok: false,
      msg: `The code: {{code}} has already been used`,
      result: { code, subsDate: userDB.subscription.subsDate },
    });
  }

  try {
    resp = await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: "Basic " + btoa(`${username}:${password}`),
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then((data) => data);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }

  if (!resp.id) {
    return res.status(200).json({
      ok: false,
      msg: `The code: {{code}} does not exist`,
      result: { code: resp.id, subsDate: "" },
    });
  }

  return res.status(200).json({
    ok: true,
    msg: `The code: {{code}} was successfully obtained`,
    result: { code: resp.id, subsDate: resp.date_created },
  });
};

export const setCode = async (req: Request, res: Response) => {
  const { code } = req.params;

  res.status(200).json({
    ok: true,
    msg: `The code: {{code}} was successfully obtained`,
    result: { code },
  });
};

import { Request, Response } from "express";
import { IResponse, returnErrorStatus } from ".";
import { IMessage, Message } from "../models";

export const getMessages = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;

  let messages: IMessage[] = [];
  let response: IResponse;

  try {
    messages = await Message.find().skip(Number(from)).limit(Number(limit));
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (messages.length > 0) {
    response = {
      ok: true,
      msg: "The list of messages was successfully obtained",
      result: {
        messages,
      },
    };

    return res.status(200).json(response);
  }

  response = {
    ok: false,
    msg: "Sorry, there are no messages to show",
    result: {},
  };

  return res.status(200).json(response);
};

export const getMessage = async (req: Request, res: Response) => {
  const { msgId } = req.params;

  let messageDB: IMessage = {} as IMessage;
  let response: IResponse;

  try {
    messageDB = await Message.findOne({ msgId });
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (messageDB) {
    response = {
      ok: true,
      msg: `The message with id: ${msgId} was successfully obtained`,
      result: messageDB,
    };
    return res.status(200).json(response);
  }

  response = {
    ok: false,
    msg: `The message with id: ${msgId} was not found or could not be retrieve`,
    result: {},
  };

  return res.status(409).json(response);
};

export const createMessage = async (req: Request, res: Response) => {
  //
  const { message } = req.body;

  let messageDB: IMessage = {} as IMessage;
  let response: IResponse;

  try {
    messageDB = new Message(message);
  } catch (error) {
    returnErrorStatus(error, res);
  }

  // Guardar en BD
  try {
    await messageDB.save();
  } catch (error) {
    returnErrorStatus(error, res);
  }

  response = {
    ok: true,
    msg: "Message created successfully",
    result: {
      user: messageDB,
    },
  };

  return res.status(201).json(response);
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { msgId } = req.params;

  let messageDB: IMessage = {} as IMessage;
  let response: IResponse;

  try {
    messageDB = await Message.findOne({ msgId });
  } catch (error) {
    returnErrorStatus(error, res);
  }

  if (!messageDB) {
    response = {
      ok: false,
      msg: `The message with id: ${msgId} does not exist`,
      result: {},
    };
    return res.status(404).json(response);
  }

  const { id } = messageDB;

  await Message.findByIdAndDelete(id);

  response = {
    ok: true,
    msg: `The message with id: ${id} was successfully deleted`,
    result: { messageDB },
  };

  return res.status(200).json(response);
};

export const saveMessage = async (msg: IMessage) => {
  //
  const message = new Message(msg);

  try {
    const saved = await message.save();
    console.log({ saved });
  } catch (error) {
    console.log(error);
  }
};

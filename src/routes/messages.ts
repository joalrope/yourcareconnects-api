import { Router } from "express";
import { body, check } from "express-validator";

import { validateFields, validateJWT } from "../middlewares";
import {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage,
} from "../controllers";

export const messageRouter = Router();

messageRouter.post(
  "/",
  [
    validateJWT,
    body("message", "Message is required").not().isEmpty(),
    validateFields,
  ],
  createMessage
);

messageRouter.get("/", getMessages);

messageRouter.get(
  "/:msgId",
  [check("msgId", "Not a valid ID").isMongoId(), validateFields],
  getMessage
);

messageRouter.delete(
  "/:msgId",
  [validateJWT, check("msgId", "Not a valid ID").isMongoId(), validateFields],
  deleteMessage
);

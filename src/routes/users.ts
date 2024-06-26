import { Router } from "express";
import { body, check } from "express-validator";

import { validateFields, validateJWT } from "../middlewares";
import { userIdAlreadyExists } from "../helpers";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersByEmail,
  changeUserRole,
  getUsersByServices,
  updateUserContacts,
  getUserMessages,
  changeValueUserRatings,
  clearUserNotifications,
  getUsersByIsActive,
  changeDeletedUserStatus,
  setUserLocation,
  thereIsSupport,
  changeActiveUserStatus,
  restoreUser,
} from "../controllers";

export const userRouter = Router();

userRouter.post(
  "/",
  [
    body("names", "Names is required").not().isEmpty(),
    body("password", "The password must be more than 6 letters").isLength({
      min: 6,
    }),
    body("email", "The email is invalid").isEmail(),
    validateFields,
  ],
  createUser
);

userRouter.get("/", getUsers);
userRouter.get("/sarole", thereIsSupport);
userRouter.get("/isActive/:typeUser", getUsersByIsActive);
userRouter.get("/email/:email", getUsersByEmail);
userRouter.get("/services/:rng/:lat/:lng", getUsersByServices);
userRouter.get("/messages/:id/:channel", getUserMessages);
userRouter.get(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  getUser
);

userRouter.put(
  "/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  updateUser
);

userRouter.put(
  "/contacts/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    body("contact", "The contact is required").not().isEmpty(),
    validateFields,
  ],
  updateUserContacts
);

userRouter.put(
  "/notifications/:receiverId/clear/:senderId",
  [
    validateJWT,
    check("senderId", "You must provide an ID").notEmpty(),
    check("senderId", "Not a valid ID").isMongoId(),
    check("senderId").custom(userIdAlreadyExists),
    check("receiverId", "You must provide an ID").notEmpty(),
    check("receiverId", "Not a valid ID").isMongoId(),
    check("receiverId").custom(userIdAlreadyExists),
    validateFields,
  ],
  clearUserNotifications
);

userRouter.put(
  "/ratings/:id",
  [
    validateJWT,
    /*check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    body("ratings", "You must provide an value").notEmpty(),
    validateFields,*/
  ],
  changeValueUserRatings
);

userRouter.put(
  "/active/:id/:value",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    check("value", "You must provide an value").notEmpty(),
    check("value", "not a valid value").isBoolean(),
    validateFields,
  ],
  changeActiveUserStatus
);

userRouter.put(
  "/deleted/:id/:value",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  changeDeletedUserStatus
);

userRouter.put(
  "/location/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    body("location", "You must provide a location").notEmpty(),
    validateFields,
  ],
  setUserLocation
);

userRouter.put(
  "/role/:id/:value",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    check("value", "You must provide an value").notEmpty(),
    check("value", "not a valid value").isString(),
    validateFields,
  ],
  changeUserRole
);

userRouter.delete(
  "/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID ").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  deleteUser
);

userRouter.put(
  "/restore/:id",
  [
    validateJWT,
    check("id", "You must provide an ID").notEmpty(),
    check("id", "Not a valid ID ").isMongoId(),
    check("id").custom(userIdAlreadyExists),
    validateFields,
  ],
  restoreUser
);

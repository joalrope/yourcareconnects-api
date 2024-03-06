import { Response } from "express";

//export { fileUpload, updateImage, showImage } from "./uploads";

export {
  getUsers,
  getUser,
  getUsersByServices,
  getUserMessages,
  getUsersByIsActive,
  getUsersByEmail,
  clearUserNotifications,
  createUser,
  thereIsSuperAdmin,
  updateUser,
  updateUserContacts,
  updateUserMessages,
  changeActiveUserStatus,
  changeUserRole,
  incrementUserNotifications,
  deleteUser,
} from "./users";
export {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServiceColor,
  setServicesColor,
} from "./services";

export {
  getModalities,
  getModality,
  createModality,
  updateModality,
  deleteModality,
} from "./modality";

export {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage,
} from "./messages";

export { getImages, uploadImage, getDocs, uploadDoc } from "./uploads";
export { getRoles, getRole, createRole, deleteRole } from "./roles";
export { createCode, getCodes, getCode, inactivateCode } from "./code";
export { changePassword, forgotPassword, login } from "./auth";
export { geti18n } from "./i18n";
export { searchUser, searchService } from "./search";

export interface IResponse {
  ok: boolean;
  msg: string;
  result: any;
  statuscode?: number;
}

export const returnErrorStatus = (error: any, res: Response) => {
  const response: IResponse = {
    ok: false,
    msg: "Please talk to the administrator",
    result: { error },
  };
  return res.status(500).json(response);
};

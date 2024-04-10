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
  thereIsSupport,
  updateUser,
  updateUserContacts,
  updateUserMessages,
  changeDeletedUserStatus,
  changeUserRole,
  setUserLocation,
  incrementUserNotifications,
  deleteUser,
  changeActiveUserStatus,
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

export { getDoc, getFiles, uploadDoc, deleteFile } from "./uploads";
export { getRoles, getRole, createRole, deleteRole } from "./roles";
export { getCode, setCode } from "./code";
export { changePassword, forgotPassword, login } from "./auth";
export { geti18n } from "./i18n";
export { searchUser, searchService } from "./search";
export { clearContacts, userHardDelete } from "./dev";

export interface IResponse {
  ok: boolean;
  msg: string;
  result: any;
  statuscode?: number;
}

export const returnErrorStatus = (
  error: any,
  res: Response,
  adic: string = ""
) => {
  const response: IResponse = {
    ok: false,
    msg: "Please talk to the administrator",
    result: { error, adic: adic },
  };
  return res.status(500).json(response);
};

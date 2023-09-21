import { Response } from "express";

//export { fileUpload, updateImage, showImage } from "./uploads";

export {
  getUsers,
  getUser,
  getUsersByServices,
  createUser,
  updateUser,
  deleteUser,
} from "./users";
export {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "./services";
export { getRoles, getRole, createRole, deleteRole } from "./roles";
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

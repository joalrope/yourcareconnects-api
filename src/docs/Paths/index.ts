import { login } from "./Auth/login";
import { userCR } from "./Users/user-CR";
import { userUD } from "./Users/userUD";
import { roleCR } from "./Roles/role-CR";
import { roleD } from "./Roles/role-D";
import { upload } from "./uploads/upload";

export const paths = {
  paths: {
    "/api/auth/login": {
      ...login,
    },
    "/api/users": {
      ...userCR,
    },
    "/api/users/{id}": {
      ...userUD,
    },
    "/api/roles": {
      ...roleCR,
    },
    "/api/roles/{id}": {
      ...roleD,
    },
    "/api/uploads": {
      ...upload,
    },
  },
};

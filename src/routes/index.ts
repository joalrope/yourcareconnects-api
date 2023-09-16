import { Express } from "express";
import { serviceRouter } from "./service";
import { uploadRouter } from "./uploads";
import { searchRouter } from "./search";
import { userRouter } from "./users";
import { roleRouter } from "./roles";
import { authRouter } from "./auth";
import { i18nRouter } from "./i18n";

interface Paths {
  services: string;
  uploads: string;
  search: string;
  users: string;
  roles: string;
  i18n: string;
  auth: string;
}

const paths: Paths = {
  services: "/api/services",
  uploads: "/api/uploads",
  search: "/api/search",
  users: "/api/users",
  roles: "/api/roles",
  i18n: "/api/i18n",
  auth: "/api/auth",
};

export const apiRoutes = (app: Express) => {
  app.use(paths.services, serviceRouter);
  app.use(paths.uploads, uploadRouter);
  app.use(paths.search, searchRouter);
  app.use(paths.users, userRouter);
  app.use(paths.roles, roleRouter);
  app.use(paths.i18n, i18nRouter);
  app.use(paths.auth, authRouter);
};

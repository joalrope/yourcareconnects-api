import { Express } from "express";
import { serviceRouter } from "./service";
import { uploadRouter } from "./uploads";
import { userRouter } from "./users";
import { roleRouter } from "./roles";
import { authRouter } from "./auth";

interface Paths {
  services: string;
  uploads: string;
  users: string;
  roles: string;
  auth: string;
}

const paths: Paths = {
  services: "/api/services",
  uploads: "/api/uploads",
  users: "/api/users",
  roles: "/api/roles",
  auth: "/api/auth",
};

export const apiRoutes = (app: Express) => {
  app.use(paths.services, serviceRouter);
  app.use(paths.uploads, uploadRouter);
  app.use(paths.users, userRouter);
  app.use(paths.roles, roleRouter);
  app.use(paths.auth, authRouter);
};

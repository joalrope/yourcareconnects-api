import { Express } from "express";
import { uploadRouter } from "./uploads";
import { userRouter } from "./users";
import { roleRouter } from "./roles";
import { authRouter } from "./auth";

interface IPaths {
  socialNetwork: string;
  smPost: string;
  uploads: string;
  users: string;
  roles: string;
  auth: string;
}

const paths: IPaths = {
  socialNetwork: "/api/social-network",
  uploads: "/api/uploads",
  smPost: "/api/smposts",
  users: "/api/users",
  roles: "/api/roles",
  auth: "/api/auth",
};

export const apiRoutes = (app: Express) => {
  app.use(paths.uploads, uploadRouter);
  app.use(paths.users, userRouter);
  app.use(paths.roles, roleRouter);
  app.use(paths.auth, authRouter);
};

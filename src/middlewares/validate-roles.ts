import { Request, Response, NextFunction } from "express";

export const isAdminRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.user) {
    return res.status(500).json({
      msg: "You want to verify the role without validating the token first",
    });
  }

  const { rol, name } = req.body.user;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} not an administrator - You do not have authorization to perform this operation`,
    });
  }

  next();
  return;
};

export const hasRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.user) {
      return res.status(500).json({
        msg: "You want to verify the role without validating the token first",
      });
    }

    if (!roles.includes(req.body.user.rol)) {
      return res.status(401).json({
        msg: `The service requires one of these roles: ${roles}`,
      });
    }

    next();
    return;
  };
};

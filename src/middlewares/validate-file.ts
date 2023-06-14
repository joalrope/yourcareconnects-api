import { Request, Response, NextFunction } from "express";

export const validateFileToUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !req.files.fileName
  ) {
    return res.status(400).json({
      msg: "There are no files to upload - validateFileUpload",
    });
  }

  const validExtensions = ["png", "jpg", "jpeg", "gif"];
  const data = JSON.parse(JSON.stringify(req.files.fileName));
  const { name } = data;
  const splitedName = name.split(".");
  const extension = splitedName[splitedName.length - 1];

  // Validate the extension
  if (!validExtensions.includes(extension)) {
    return res.status(409).json({
      ok: false,
      msg: `The extension "${extension}" is not allowed, only extensions are allowed: ${validExtensions}`,
      result: {},
    });
  }

  next();

  return;
};

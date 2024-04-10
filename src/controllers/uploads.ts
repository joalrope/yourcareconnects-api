import { Request as Req, Response as Resp } from "express";
import path from "path";
import fs from "fs";
import { readdir } from "fs/promises";
import { PDFDocument } from "pdf-lib";

interface IFile {
  uid: string;
  name: string;
  status: string;
  url: string;
}

export const uploadDoc = async (_req: Req, res: Resp) => {
  return res.status(200).json({
    ok: true,
    msg: "Successfully uploaded Docs",
    result: { doc: "doc.pdf" },
  });
};

export const getDoc = async (req: Req, res: Resp) => {
  const { id, name } = req.params;

  //TODO:: Cambiar path para la ruta correcta en produccion
  const dir =
    process.env.NODE_ENV === "development"
      ? path.join(__dirname, `../../uploads/${id}/docs`)
      : `${process.env.DISK_MOUNT_PATH}/uploads/${id}/docs`;
  const fullPath = `${dir}/${name}`;
  const pdfBytes = fs.readFileSync(fullPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const onlyName = path.parse(fullPath).name;

  pdfDoc.setTitle(onlyName);

  const pdfModified = await pdfDoc.save();

  fs.writeFileSync(fullPath, pdfModified);

  if (!fs.existsSync(`${dir}`)) {
    return res.status(200).json({
      ok: false,
      msg: "it Cannot be found",
      result: { Doc: null },
    });
  }

  fs.readFile(fullPath, function (_err, data) {
    res.contentType("application/pdf");
    res.send(data);
  });
  return;
};

export const getFiles = async (req: Req, res: Resp) => {
  const { id, type } = req.params;
  const diskMountPath =
    process.env.NODE_ENV === "development"
      ? path.join(__dirname, `../../../Backend`)
      : process.env.DISK_MOUNT_PATH;

  const dir = `${diskMountPath}/uploads/${id}/${type}`;

  if (!fs.existsSync(`${dir}`)) {
    return res.status(200).json({
      ok: true,
      msg: "files successfully obtained",
      result: { fileList: [] },
    });
  }

  const files = await readdir(dir);

  const fileList: IFile[] = [] as IFile[];

  files.map((file, index) => {
    fileList.push({
      uid: `${String(index + 1)}`,
      name: file,
      status: "done",
      url:
        process.env.NODE_ENV === "development"
          ? `${req.protocol}://${req.hostname}:${process.env.PORT}/uploads/${id}/${type}/${file}`
          : `${process.env.DISK_MOUNT_PATH}/uploads/${id}/${type}/${file}`,
    });
  });

  return res.status(200).json({
    ok: true,
    msg: "files successfully obtained",
    result: { fileList },
  });
};

export const deleteFile = async (req: Req, res: Resp) => {
  const { id, name } = req.params;

  const ext = name.slice(((name.lastIndexOf(".") - 1) >>> 0) + 2);

  const type = ext === "pdf" ? "docs" : "images";

  let dir =
    process.env.NODE_ENV === "development"
      ? path.join(__dirname, `../../uploads/${id}/${type}/${name}`)
      : `${process.env.DISK_MOUNT_PATH}/uploads/${id}/${type}/${name}`;

  try {
    fs.unlinkSync(dir);
  } catch (err) {
    console.error("Something wrong happened removing the file", err);
  }

  res.status(200).json({
    ok: true,
    msg: "files successfully obtained",
    result: { id, name },
  });
};

import { Request, Response } from "express";

import { IService, Service } from "../models/index";
import { getColorHex, setColorHex } from "../helpers";
import { IRes } from "../helpers/color-hex";

export const getServices = async (_req: Request, res: Response) => {
  //
  try {
    const [total, services] = await Promise.all([
      Service.countDocuments(),
      Service.find(),
    ]);

    return res.status(200).json({
      ok: true,
      msg: "The list of services was successfully obtained",
      result: {
        total,
        services,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const getService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userDB = await Service.findById(id);

    if (userDB) {
      if (userDB.isActive) {
        return res.status(200).json({
          ok: true,
          msg: `The user with id: ${id} was successfully obtained`,
          result: userDB,
        });
      }

      return res.status(200).json({
        ok: false,
        msg: `The user with id: ${id} is inactive`,
        result: userDB,
        statuscode: 409,
      });
    }

    return res.status(409).json({
      ok: false,
      msg: `The user with id: ${id} is inactive`,
      result: userDB,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const createService = async (req: Request, res: Response) => {
  const { title, color } = req.body;

  try {
    let serviceDB = await Service.findOne({ title }, { new: true });

    if (serviceDB) {
      return res.status(201).json({
        ok: false,
        msg: `There is already a service with the title ${title}`,
        result: {},
      });
    }

    const service = new Service({
      title,
      value: title,
      tagColor: color,
    });

    // Guardar en BD
    await service.save();

    return res.status(201).json({
      ok: true,
      msg: "Service created successfully",
      result: service,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const updateService = async (req: Request, res: Response) => {
  const { parent, title, color } = req.body;

  try {
    if (!parent.includes(".") && parent.split(".").length === 1) {
      const updatedService = await Service.findOneAndUpdate(
        { title: parent },
        {
          $push: {
            children: {
              title,
              value: title,
              tagColor: color,
            },
          },
        },
        { new: true }
      );

      if (updatedService) {
        return res.status(200).json({
          ok: true,
          msg: "Service updated successfully",
          result: updatedService,
        });
      }
    }

    const splited = parent.split(".");

    if (!parent.includes(".") && parent.split(".").length === 2) {
      const updatedService = await Service.findByIdAndUpdate(
        {
          title: splited[0],
          "children.title": splited[1],
        },
        {
          $push: {
            "children.$.children": {
              title,
              value: title,
              tagColor: color,
            },
          },
        }
      ).then((doc: Array<any>) => doc.push({ title, value: title }));

      if (updatedService) {
        return res.status(200).json({
          ok: true,
          msg: "Service updated successfully",
          result: updatedService,
        });
      }
    }

    const updatedService = await Service.updateOne(
      { title: splited[0] },
      {
        $push: {
          "children.$[child].children": {
            title,
            value: title,
            tagColor: color,
          },
        },
      },
      {
        arrayFilters: [{ "child.title": splited[1] }],
      }
    );

    if (updatedService) {
      return res.status(200).json({
        ok: true,
        msg: "Service updated successfully",
        result: updatedService,
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
  return res.status(409).json({
    ok: false,
    msg: "Service failed to be updated",
    result: {},
  });
};

export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await Service.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    return res.status(204).json({
      ok: true,
      msg: "User deleted successfully",
      result: user,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const getServiceColor = async (req: Request, res: Response) => {
  const { services } = req.body;

  if (services.length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "Couldn't get services, don't exist",
      result: [],
    });
  }

  let result: IRes[] = [];
  let servicesDB;

  try {
    servicesDB = await Service.find();
  } catch (error) {
    console.log(error);
    return services;
  }

  for (const serv of services) {
    const title = serv.split("|").pop() as string;

    const servData: IRes[] = getColorHex(servicesDB, title);

    result.push(servData[0]);
  }

  if (result.length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "Couldn't get services, don't exist",
      result,
    });
  }

  return res.status(200).json({
    ok: true,
    msg: "servicesWithColor get successfully",
    result,
  });
};

export const setServicesColor = async (_req: Request, res: Response) => {
  let result: IService[] = [];

  try {
    result = await Service.find();
  } catch (error) {
    console.log(error);
    return result;
  }

  setColorHex(result);

  for (const serv of result) {
    await Service.findByIdAndUpdate(
      { _id: serv.id },
      { ...serv },
      { new: true }
    );
  }

  if (result.length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "Couldn't get services, don't exist",
      result,
    });
  }

  return res.status(200).json({
    ok: true,
    msg: "servicesWithColor get successfully",
    result,
  });
};

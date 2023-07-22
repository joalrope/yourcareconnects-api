import { Request, Response } from "express";

import { Service } from "../models/index";

export const getServices = async (req: Request, res: Response) => {
  //const { limit = 5, from = 0 } = req.query;

  console.log(req.query);

  try {
    const [total, services] = await Promise.all([
      Service.countDocuments(),
      //Service.find().skip(Number(from)).limit(Number(limit)),
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
  const { title } = req.body;

  try {
    let serviceDB = await Service.findOne({ title });

    if (serviceDB) {
      return res.status(201).json({
        ok: false,
        msg: `There is already a service with the title ${title}`,
        result: {},
      });
    }

    const service = new Service({ title, value: title });

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
  const { parent, title, child } = req.body;
  const push = !child
    ? { children: { title, value: title } }
    : { children: { title, value: title, children: child } };

  try {
    const savedService = await Service.updateOne(
      { title: parent },
      {
        $push: {
          ...push,
        },
      }
    );

    if (savedService) {
      return res.status(200).json({
        ok: true,
        msg: "Service updated successfully",
        result: savedService,
      });
    }
    return;
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
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

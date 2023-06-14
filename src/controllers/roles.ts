import { Request, Response } from "express";

import { Role } from "../models/index";
import { getUserData } from "../helpers/jwt";

export const getRoles = async (req: Request, res: Response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { isActive: true };

  try {
    const [total, roles] = await Promise.all([
      Role.countDocuments(query),
      Role.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    return res.status(200).json({
      ok: true,
      msg: "The list of roles was successfully obtained",
      result: {
        total,
        roles,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: {},
    });
  }
};

export const getRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const roleDB = await Role.findById(id);

    if (roleDB) {
      return res.status(200).json({
        ok: true,
        msg: `The role with id: ${id} was successfully obtained`,
        result: roleDB,
      });
    }

    return res.status(409).json({
      ok: false,
      msg: `The role with id: ${id} is inactive`,
      result: roleDB,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: { error },
    });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    let roleDB = await Role.findOne({ name });

    if (roleDB) {
      return res.status(409).json({
        ok: false,
        msg: `There is already a role with the name ${roleDB}`,
        result: {},
      });
    }

    const { userId } = getUserData(req);

    const role = new Role({ name, userId });

    // Guardar en BD
    await role.save();

    return res.status(201).json({
      ok: true,
      msg: "Role created successfully",
      result: {
        role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: error,
    });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const role = await Role.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return res.status(204).json({
      ok: true,
      msg: "Role deleted successfully",
      result: role,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
      result: {},
    });
  }
};

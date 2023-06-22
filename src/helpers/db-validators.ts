import { Schema } from "mongoose";
import { User, Role } from "../models";

export const roleIsValid = async (role: string) => {
  try {
    const roleDB = await Role.findOne({ role });

    if (!roleDB) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const emailAlreadyExists = async (email: string = "") => {
  // Verificar si el correo existe
  const emailDB = await User.findOne({ email });
  if (emailDB) {
    throw new Error(`The email: ${email}, is already registered`);
  }
};

export const userIdAlreadyExists = async (id: Schema.Types.ObjectId) => {
  // Verificar si el id existe
  const userDB = await User.findById(id);

  if (!userDB) {
    throw new Error(`User with id: ${id} does not exist`);
  }
};

import { Schema, model } from "mongoose";

export interface rrssUser {
  snId: Schema.Types.ObjectId;
  credential: string;
  isActive: boolean;
}

const snSchema = new Schema<rrssUser>(
  {
    snId: {
      type: Schema.Types.ObjectId,
      ref: "SocialNetwork",
      required: false,
    },
    credential: {
      type: String,
      required: [true, "La clave de acceso al api es obligatorio"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

interface User {
  uid: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  picture: string;
  role: string;
  socialNetworks: [rrssUser];
  isActive: boolean;
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    picture: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "USER_ROLE",
      enum: ["ADMIN_ROLE", "USER_ROLE"],
    },
    socialNetworks: [snSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.id = _id;
  return user;
};

export const User = model("User", UserSchema);

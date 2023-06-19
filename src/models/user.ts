import { Schema, model } from "mongoose";

interface User {
  uid: Schema.Types.ObjectId;
  names: string;
  surnames: string;
  email: string;
  password: string;
  phonenumber: string;
  role: string;
  isActive: boolean;
  address?: string;
  zipcode?: string;
  faxnumber?: string;
  picture?: string;
  company?: string;
  owner?: string;
  webpage?: string;
  services?: string[];
  modality?: string;
  certificates?: string[];
}

const UserSchema = new Schema<User>(
  {
    names: {
      type: String,
      required: [true, "Name is required"],
    },
    surnames: {
      type: String,
      required: [true, "Surname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "The password is required"],
    },
    phonenumber: {
      type: String,
      required: [true, "The phonenumber is required"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    faxnumber: {
      type: String,
    },
    company: {
      type: String,
    },
    owner: {
      type: String,
    },
    webpage: {
      type: String,
    },
    services: {
      type: [String],
    },
    modality: {
      type: String,
    },
    certificates: {
      type: [String],
    },
    picture: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "customer",
      enum: ["superadmin", "admin", "customer", "provider"],
    },
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

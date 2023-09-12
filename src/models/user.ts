import { Schema, model } from "mongoose";

interface User {
  uid: Schema.Types.ObjectId;
  names: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  balance?: number;
  points?: number;
  role: string;
  isDeleted: boolean;
  notifications?: number;
  address?: string;
  zipCode?: string;
  faxNumber?: string;
  picture?: string;
  company?: string;
  owner?: string;
  webPage?: string;
  services?: string[];
  serviceModality?: string[];
  certificates?: string[];
}

const UserSchema = new Schema<User>(
  {
    names: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
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
    phoneNumber: {
      type: String,
      required: [true, "The phonenumber is required"],
    },
    balance: {
      type: Number,
      default: 0.1,
    },
    points: {
      type: Number,
      default: 0,
    },
    notifications: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    faxNumber: {
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
    serviceModality: {
      type: [String],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

UserSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.id = _id;
  return user;
};

export const User = model("User", UserSchema);

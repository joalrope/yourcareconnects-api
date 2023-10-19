import mongoose, { Document, model, Schema } from "mongoose";

export interface IResetPassword {
  token: string;
  expires: number;
}

const resetPassword = new Schema<IResetPassword>({
  token: {
    type: String,
    default: "",
  },
  expires: {
    type: Number,
    default: 0,
  },
});

export interface IUser extends Document {
  id?: string;
  uid: mongoose.Types.ObjectId;
  names: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  biography?: string;
  balance?: number;
  points?: number;
  role: string;
  isDeleted: boolean;
  notifications?: number;
  address?: string;
  resetPassword?: IResetPassword;
  zipCode?: string;
  faxNumber?: string;
  pictures?: Object;
  company?: string;
  owner?: string;
  webUrl?: string;
  ratings?: number;
  services?: string[];
  serviceModality?: string[];
  certificates?: string[];
}

const UserSchema = new Schema<IUser>(
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
    biography: {
      type: String,
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
    resetPassword: {
      type: resetPassword,
      default: { token: "", expires: 0 },
    },
    company: {
      type: String,
    },
    owner: {
      type: String,
    },
    webUrl: {
      type: String,
    },
    services: {
      type: [String],
      default: [],
    },
    serviceModality: {
      type: [String],
      default: [],
    },
    certificates: {
      type: [String],
    },
    pictures: {
      type: Object,
      default: { profile: "" },
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

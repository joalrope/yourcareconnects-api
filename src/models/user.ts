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

interface ILocation {
  lat: { type: Number; default: 0 };
  lng: { type: Number; default: 0 };
}

export interface IUser extends Document {
  address?: string;
  balance?: number;
  biography?: string;
  company?: string;
  contacts?: string[];
  certificates?: string[];
  email: string;
  faxNumber?: string;
  fullname?: string;
  id?: string;
  isDeleted: boolean;
  lastName: string;
  location: ILocation;
  names: string;
  notifications?: number;
  owner?: string;
  password: string;
  phoneNumber: string;
  pictures?: Object;
  points?: number;
  ratings?: number;
  resetPassword?: IResetPassword;
  role: string;
  services?: string[];
  serviceModality?: string[];
  uid: mongoose.Types.ObjectId;
  webUrl?: string;
  zipCode?: string;
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
    location: {
      lat: {
        type: Number,
        default: 0,
      },
      lng: {
        type: Number,
        default: 0,
      },
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
    contacts: {
      type: [String],
      default: [],
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

  user.fullname = `${user.names} ${user.lastName}`;
  return user;
};

export const User = model("User", UserSchema);

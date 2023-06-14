import { Schema, model } from "mongoose";

interface IRole {
  uid: Schema.Types.ObjectId;
  name: string;
  isActive: boolean;
  userId: Schema.Types.ObjectId;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, "El rol es obligatorio"],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Role = model("Role", RoleSchema);

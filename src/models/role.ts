import { Schema, model } from "mongoose";

interface IRole {
  uid: Schema.Types.ObjectId;
  name: string;
  isDeleted: boolean;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, "role is required"],
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

RoleSchema.pre('find', function() {
  this.where({ isDeleted: false });
});
  
RoleSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

export const Role = model("Role", RoleSchema);

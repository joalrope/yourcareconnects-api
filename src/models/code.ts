import { Schema, model } from "mongoose";

export interface ICode extends Document {
  uid: Schema.Types.ObjectId;
  code: string;
  email: string;
  isActive: boolean;
}

const CodeSchema = new Schema<ICode>(
  {
    code: {
      type: String,
      required: [true, "code is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
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

export const Code = model("Code", CodeSchema);

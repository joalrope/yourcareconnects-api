import { Document, model, Schema } from "mongoose";

export interface IMessages extends Document {
  uid: Schema.Types.ObjectId;
  title: string;
  value: string;
  tagColor: string;
  isDeleted: boolean;
}

const MessagesSchema = new Schema<IMessages>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "sender is required"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "receiver is required"],
    },
    message: {
      type: String,
    },
    time: {
      type: Date,
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

MessagesSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

MessagesSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

MessagesSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});

MessagesSchema.methods.toJSON = function () {
  const { __v, _id, ...modality } = this.toObject();
  modality.id = _id;
  return modality;
};

export const Modality = model("Modality", MessagesSchema);

import { Document, model, Schema } from "mongoose";

export interface IModality extends Document {
  uid: Schema.Types.ObjectId;
  title: string;
  value: string;
  tagColor: string;
  isDeleted: boolean;
}

const ModalitySchema = new Schema<IModality>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    value: {
      type: String,
    },
    tagColor: {
      type: String,
      default: "#" + Math.floor(Math.random() * 16777215).toString(16),
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

ModalitySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

ModalitySchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

ModalitySchema.pre("findById", function () {
  this.where({ isDeleted: false });
});

ModalitySchema.methods.toJSON = function () {
  const { __v, _id, ...modality } = this.toObject();
  modality.id = _id;
  return modality;
};

export const Modality = model("Modality", ModalitySchema);

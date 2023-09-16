import { Document, model, Schema } from "mongoose";

export interface IService extends Document {
  uid: Schema.Types.ObjectId;
  title: string;
  value: string;
  children?: object[];
  tagColor: object;
  isDeleted: boolean;
}

const ChildrenSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    value: {
      type: String,
    },
    children: {
      type: [Object],
    },
    tagColor: {
      type: Object,
      default: {
        bgc: "#" + Math.floor(Math.random() * 16777215).toString(16),
        frc: "#" + Math.floor(Math.random() * 16777215).toString(16),
      },
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

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    value: {
      type: String,
    },
    children: {
      type: [ChildrenSchema],
    },
    tagColor: {
      type: Object,
      default: {
        bgc: "#" + Math.floor(Math.random() * 16777215).toString(16),
        frc: "#" + Math.floor(Math.random() * 16777215).toString(16),
      },
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

ServiceSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

ServiceSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

ServiceSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});

ServiceSchema.methods.toJSON = function () {
  const { __v, _id, ...service } = this.toObject();
  service.id = _id;
  return service;
};

export const Service = model("Service", ServiceSchema);

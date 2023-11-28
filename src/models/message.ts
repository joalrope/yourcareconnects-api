import { Document, model, Schema } from "mongoose";

export enum IMessageType {
  AUDIO = "audio",
  FILE = "file",
  IMAGE = "image",
  TEXT = "text",
  VIDEO = "video",
}

export enum IMessageDirection {
  INCOMING = "incoming",
  OUTGOING = "outgoing",
}

export enum IMessagePosition {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  SINGLE = "single",
  FIRST = "first",
  NORMAL = "normal",
  LAST = "last",
}

export interface IMessage extends Document {
  msgId: string;
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  message: string;
  sentTime: Date;
  type: IMessageType;
  direction: IMessageDirection;
  position: IMessagePosition;
}

const MessageSchema = new Schema<IMessage>(
  {
    msgId: {
      type: String,
    },
    senderId: {
      type: Schema.Types.ObjectId,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
    },
    message: {
      type: String,
    },
    sentTime: {
      type: Date,
    },
    type: {
      type: IMessageType,
    },
    direction: {
      type: IMessageDirection,
    },
    position: {
      type: IMessagePosition,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.methods.toJSON = function () {
  const { __v, _id, ...message } = this.toObject();
  message.id = _id;

  return message;
};

export const Message = model("Message", MessageSchema);

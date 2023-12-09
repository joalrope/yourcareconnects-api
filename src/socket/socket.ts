import { Server, Socket } from "socket.io";
import { updateUserMessages, incrementUserNotifications } from "../controllers";

interface newUsers {
  names: string;
  socketId: string;
}

interface connectedUsers {
  [key: string]: newUsers;
}

const connectedUsers: connectedUsers = {};

export function setupSockets(server: any) {
  const io = new Server(server, {
    cors: {
      origin: process.env.URL_BASE,
      methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("signIn", ({ id, names, socketId }) => {
      if (id && names && socketId) {
        connectedUsers[id] = {
          names,
          socketId,
        };

        //console.log("connectedUsers: ", connectedUsers);
        io.emit("connectedUsers", connectedUsers);
      }
    });

    socket.on("joinRoom", (data) => {
      socket.join(data);
      console.log("sender: ", data, "is connected withsocket id: ", socket.id);
    });

    socket.on("userIsTyping", ({ isTyping, names }) => {
      socket.broadcast.emit("userIsTyping", { isTyping, names });
    });

    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId } = data;

      socket.emit("receiveMessage", data);

      await updateUserMessages(senderId, receiverId, data);

      const receiverMessage = {
        ...data,
        direction: "incoming",
        position: "left",
      };

      if (connectedUsers.hasOwnProperty(receiverId)) {
        const socketId = connectedUsers[receiverId].socketId;

        socket.to(socketId).emit("receiveMessage", receiverMessage);
      } else {
        //console.log("sending notification");
        //TODO: send notification verify
        const { notifications } = await incrementUserNotifications(
          senderId,
          receiverId
        );

        //console.log({ notifications: notifications[`id${senderId}`] });

        socket.emit("updateNotifications", notifications[`id${senderId}`]);
      }

      await updateUserMessages(receiverId, senderId, receiverMessage);
    });

    socket.on("disconnect", () => {
      for (let key in connectedUsers) {
        if (connectedUsers[key].socketId === socket.id) {
          delete connectedUsers[key];
        }
      }
    });
  });
}

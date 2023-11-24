import { Server, Socket } from "socket.io";
import { updateUserMessages } from "../controllers";

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
      origin: "http://localhost:3000",
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

      if (connectedUsers.hasOwnProperty(receiverId)) {
        const socketId = connectedUsers[receiverId].socketId;
        const receiverMessage = {
          ...data,
          direction: "incoming",
          position: "left",
        };
        socket.to(socketId).emit("receiveMessage", receiverMessage);
        await updateUserMessages(receiverId, senderId, receiverMessage);
      } else {
        //TODO: save message in DB to send it later, when user is connected
      }
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

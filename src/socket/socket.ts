import { Server, Socket } from "socket.io";

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
        console.log("Client signed in", { id, names, socketId });

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
      console.log("Client is typing", { isTyping, names });
      socket.broadcast.emit("userIsTyping", { isTyping, names });
    });

    socket.on("sendMessage", (data) => {
      const { receiverId } = data;

      const socketId = receiverId ? connectedUsers[receiverId].socketId : "";

      if (!socketId) {
        socket.emit("unsentMessage", data);
        return;
      }

      socket.to(socketId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);

      for (let key in connectedUsers) {
        if (connectedUsers[key].socketId === socket.id) {
          delete connectedUsers[key];
        }
      }
    });
  });
}

import { Server, Socket } from "socket.io";

interface ConnectedUsers {
  id: string | string[] | undefined;
  names: string | string[] | undefined;
  socketId: string;
}

export function setupSockets(server: any) {
  const connectedUsers: ConnectedUsers[] = [];

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    const { id, names } = socket.handshake.query;

    if (connectedUsers.some((user) => user.id === id)) {
      socket.disconnect();
      return;
    }

    connectedUsers.push({
      id,
      names,
      socketId: socket.id,
    });

    socket.on("joinRoom", (data) => {
      socket.join(data);
      console.log("sender: ", data, "is connected withsocket id: ", socket.id);
    });

    socket.on("sendMessage", (data) => {
      console.log("sendMessage: ", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      if (connectedUsers.length > 0) {
        connectedUsers.splice(
          connectedUsers.findIndex((user) => user.socketId === socket.id),
          1
        );
      }
    });
  });
}

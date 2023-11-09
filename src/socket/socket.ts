import { Server, Socket } from "socket.io";

export function setupSockets(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Client connected with id: ", socket.id);

    socket.on("joinRoom", (data) => {
      socket.join(data);
      console.log("socket id: ", socket.id, "socket connected status: ", data);
    });

    socket.on("sendMessage", (data) => {
      console.log("sendMessage: ", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
}

import { Server, Socket } from "socket.io";

interface newUsers {
  names: string;
  socketId: string;
}

interface connectedUsers {
  [key: string]: newUsers;
}

export function setupSockets(server: any) {
  const connectedUsers: connectedUsers = {};

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const clients: string[] = [];

  io.on("connection", (socket: Socket) => {
    console.log(`client connecting on server with socket id:${socket.id}`);

    clients.push(socket.id);

    console.log(clients);

    //socket.emit("requestInfo", socket.id);

    /* socket.on("sendData", (data) => {
      // Manipulate the data here
      const { id, names, socketId } = data;

      if (id && names) {
        connectedUsers[id] = {
          names,
          socketId,
        };

        console.log("new user connected", { id, names, socketId: socket.id });

        //io.emit("connectedUsers", connectedUsers);
      }
    }); */

    socket.on("signIn", ({ id, names, socketId }) => {
      if (id && names) {
        console.log("Client signed in", { id, names, socketId });
        connectedUsers[id] = {
          names,
          socketId,
        };

        //kkkkk

        io.emit("connectedUsers", connectedUsers);
      }
    });

    socket.on("joinRoom", (data) => {
      socket.join(data);
      console.log("sender: ", data, "is connected withsocket id: ", socket.id);
    });

    socket.on("sendMessage", (data) => {
      console.log({ connectedUsers });
      console.log("sendMessage", data);
      socket.to(data.receiver.socketId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);

      /* for (var key in connectedUsers) {
        var objectInKey = connectedUsers[key];

        if (objectInKey["socketId"] === socket.id) {
          delete connectedUsers[key];
        }
      }
      console.log({ connectedUsers });
      socket.broadcast.emit("connectedUsers", connectedUsers); */
    });
  });
}

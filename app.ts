import { config } from "dotenv";
import { Server } from "./src/server";
config();

const server = new Server();

server.listen();

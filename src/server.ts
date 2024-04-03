import express, { Express } from "express";
import { createServer } from "http";
import cors from "cors";
import { dbConnection, seedDB } from "./database/config";
import { setupSockets } from "./socket/socket";
import swaggerUI from "swagger-ui-express";
//import { swaggerStart } from "./docs/swagger-start";
import { options } from "./docs/index";
import { apiRoutes } from "./routes";
//import { morganMiddleware } from "./middlewares";

const dbClear = String(process.env.DB_CLEAR);

export class Server {
  app: Express;
  port: string | undefined;
  server: any;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.port = process.env.PORT || "8080";

    // Database connection
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Application routes
    apiRoutes(this.app);

    // WebSocket
    setupSockets(this.server);

    // seed database with first data

    console.log({ dbClear });

    if (dbClear === "true") {
      seedDB();
    }
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    const origin = [
      String(process.env.URL_BASE1),
      String(process.env.URL_BASE2),
    ];
    this.app.use(
      cors({
        origin,
      })
    );

    // Reading and parsing the body
    this.app.use(express.json());

    // HTTP logger
    // this.app.use(morganMiddleware);

    // statics Directories
    this.app.use(express.static("public"));
    this.app.use(express.static("uploads"));

    // Swagger integration
    this.app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(options));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
      //swaggerStart();
    });
  }
}

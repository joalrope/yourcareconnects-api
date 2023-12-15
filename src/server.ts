import express, { Express } from "express";
import { createServer } from "http";
import cors from "cors";
import mongoose from "mongoose";
import { dbConnection } from "./database/config";
import { setupSockets } from "./socket/socket";
import swaggerUI from "swagger-ui-express";
//import { swaggerStart } from "./docs/swagger-start";
import { options } from "./docs/index";
import { apiRoutes } from "./routes";
import { Modality, Service, User } from "./models";
import servicesJson from "../public/yourcareconnects.services.json";
import modalitiesJson from "../public/yourcareconnects.modalities.json";

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
    const seedDB = async () => {
      const colecciones = mongoose.modelNames();

      colecciones.forEach(async (colection) => {
        if (colection === "User") {
          const total = await mongoose
            .model(colection)
            .estimatedDocumentCount();

          if (total === 0) {
            await Service.deleteMany({});
            await Service.insertMany(servicesJson);
            await Modality.deleteMany({});
            await Modality.insertMany(modalitiesJson);
            await User.deleteMany({});
          }
        }
      });
    };

    seedDB();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    const origin = [String(process.env.URL_BASE)];
    this.app.use(
      cors({
        origin,
      })
    );

    // Reading and parsing the body
    this.app.use(express.json());

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

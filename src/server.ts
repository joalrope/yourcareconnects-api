import express, { Express } from "express";
import cors from "cors";
import { dbConnection } from "./database/config";
import swaggerUI from "swagger-ui-express";
//import { swaggerStart } from "./docs/swagger-start";
import { options } from "./docs/index";
import { apiRoutes } from "./routes";

export class Server {
  app: Express;
  port: string | undefined;
  routes: any;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8080";

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes = apiRoutes(this.app);

    this.app.use(function (_, res) {
      res.redirect("/");
    });
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "https://yourcareconnects-app.onrender.com",
        ],
      })
    );

    // Reading and parsing the body
    this.app.use(express.json());

    // statics Directories
    this.app.use(express.static("public"));
    this.app.use(express.static("uploads"));
    //this.app.use("/public", express.static(__dirname + "/public"));
    //this.app.use("/uploads", express.static(__dirname + "/uploads"));

    // Swagger integration
    this.app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(options));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
      //swaggerStart();
    });
  }
}

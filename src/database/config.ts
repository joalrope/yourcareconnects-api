import mongoose from "mongoose";
import { Modality, Service, User } from "../models";
import servicesJson from "../../public/yourcareconnects.services.json";
import modalitiesJson from "../../public/yourcareconnects.modalities.json";

export const dbConnection = async () => {
  const dbName = process.env.MONGO_DBNAME;
  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;
  const cluster = process.env.MONGO_CLUSTER;
  const container = process.env.MONGO_CONTAINER;

  const isLocal = false;

  const cnnOptions = {
    development: isLocal
      ? "mongodb://127.2.0.1:27017/yourcareconnects"
      : `mongodb+srv://${user}:${password}@${cluster}`,
    production: `${container}`,
  };

  let connectionString = "";

  if (process.env.NODE_ENV === "development") {
    connectionString = cnnOptions.development;
  } else {
    connectionString = cnnOptions.production;
  }

  try {
    await mongoose
      .connect(connectionString, {
        dbName: `${dbName}`,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
      })
      .then(() => console.log("connection successful...."))
      .catch((err) => console.error(err));
  } catch (error) {
    console.log(error);
    throw new Error("Error when starting the database");
  }
};

export const seedDB = async () => {
  await Service.deleteMany({});
  await Service.insertMany(servicesJson);
  await Modality.deleteMany({});
  await Modality.insertMany(modalitiesJson);
  await User.deleteMany({});
};

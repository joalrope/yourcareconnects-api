import mongoose from "mongoose";

export const dbConnection = async () => {
  //const dbName = process.env.MONGO_DBNAME;
  //const user = process.env.MONGO_USER;
  //const password = process.env.MONGO_PASSWORD;
  //const cluster = process.env.MONGO_CLUSTER;

  try {
    await mongoose
      //.connect(`mongodb+srv://${user}:${password}@${cluster}`, {
      //.connect("mongodb://127.0.0.1:27017/yourcareconnects", {
      //.connect(`mongodb://${user}:${password}@${cluster}`, {
      .connect(`mongodb://mongo-o32u:27017/`, {
        //dbName: `${dbName}`,
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

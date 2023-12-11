import mongoose from "mongoose";

export const dbConnection = async () => {
  //const user = process.env.MONGO_USER;
  //const password = process.env.MONGO_PASSWORD;
  //const cluster = process.env.MONGO_CLUSTER;

  try {
    await mongoose
      //.connect(`mongodb+srv://${user}:${password}@${cluster}`, {
      .connect("mongodb://127.0.0.1:27017/yourcareconnects", {
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

//mongodb://localhost:27017

//mongodb+srv://joalrope:Cheo.-2436@localhost/?authMechanism=DEFAULT
//`mongodb+srv://${user}:${password}@${cluster}`

import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose
      .connect(String(process.env.MONGODB_URI), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => console.log("connection successful...."))
      .catch((err) => console.error(err));
  } catch (error) {
    console.log(error);
    throw new Error("Error when starting the database");
  }
};

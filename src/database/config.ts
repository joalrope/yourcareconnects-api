import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(String(process.env.MONGODB_URI), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("Base de datos online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

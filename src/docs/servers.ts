import { config } from "dotenv";

config();

export const servers = {
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
      description: "Local server",
    },
  ],
};

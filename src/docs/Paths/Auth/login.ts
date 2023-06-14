import { response } from "../response";
export const login = {
  post: {
    tags: ["Auth"],
    summary: "Sign in to the app.",
    consumes: ["application/json"],
    produce: ["application/json"],
    name: "user",
    in: "body",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: {
                type: "string",
                description: "The user's email",
              },
              password: {
                type: "string",
                description: "The user's password",
              },
            },
            example: {
              email: "contact@bohiques.com",
              password: "Bo.-hi2023",
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "token.",
        content: { ...response },
      },
      "409": {
        description: "The request can't be processed.",
        content: { ...response },
      },
    },
  },
};

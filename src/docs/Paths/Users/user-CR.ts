export const userCR = {
  post: {
    tags: ["Users"],
    summary: "Creates a new user.",
    consumes: ["application/json"],
    produce: ["application/json"],
    name: "user",
    in: "body",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              id: {
                $ref: "#/components/schemas/id",
              },
              name: {
                type: "string",
                description: "The user's name",
              },
              email: {
                type: "string",
                description: "The user's email",
              },
              password: {
                type: "string",
                description: "The user's password",
              },
              picture: {
                type: "string",
                description: "The user's avatar",
              },
              role: {
                type: "string",
                description: "The user's role",
              },
            },
            example: {
              name: "Bohiques Contact",
              email: "contact@bohiques.com",
              password: "Bo.-hi2023",
              picture: "https://cloudinary.com/45lok999ugt55f4.png",
              socialNetworks: [
                {
                  snId: "644b0665d078621d04319da7",
                  credential: "a34d5523900ca34ddssxx56fcd",
                },
                {
                  snId: "644b06ccd078621d04319dab",
                  credential: "acd8-hh65-34cd-45ca-000a",
                },
              ],
              role: "USER_ROLE",
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "A user object.",
        content: {
          // content-type
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Response", // response model
            },
          },
        },
      },
      "409": {
        description: "The request can't be processed.",
        content: {
          // content-type
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Response", // response model
            },
          },
        },
      },
    },
  },
  get: {
    tags: ["Users"], // operation's tag.
    summary: "User list.",
    produce: ["application/json"],
    parameters: [], // expected params.
    // expected responses
    responses: {
      // response code
      200: {
        description: "User List were obtained", // response desc.
        content: {
          // content-type
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Response", // response model
            },
          },
        },
      },
    },
  },
};

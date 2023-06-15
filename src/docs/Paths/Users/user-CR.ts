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
            required: ["names", "surnames", "phonenumber", "email", "password"],
            properties: {
              id: {
                $ref: "#/components/schemas/id",
              },
              names: {
                type: "string",
                description: "The user's name",
              },
              surnames: {
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
              address: {
                type: "string",
                description: "The user's addres",
              },
              zipcode: {
                type: "string",
                description: "The user's zipcode",
              },
              phonenumber: {
                type: "string",
                description: "The user's phone number",
              },
              services: {
                type: "[string]",
                description: "Sevices provide by user",
              },
              modality: {
                type: "string",
                description: "The user's modality",
              },
              role: {
                type: "string",
                description: "The user's role",
              },
            },
            example: {
              names: "Bohiques",
              surnames: "Contact",
              email: "contact@bohiques.com",
              phonenumber: "+17851265555",
              password: "Bo.-hi2023",
              role: "customer",
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

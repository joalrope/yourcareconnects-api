export const roleCR = {
  post: {
    tags: ["Roles"],
    summary: "Creates a new role.",
    consumes: ["application/json"],
    produce: ["application/json"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    name: "role",
    in: "body",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name"],
            properties: {
              id: {
                $ref: "#/components/schemas/id",
              },
              name: {
                type: "string",
                description: "The user's name",
              },
            },
            example: {
              name: "VENDOR_ROLE",
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "A role object.",
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
      "500": {
        description: "an internal, unhandled error has occurred",
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
    tags: ["Roles"], // operation's tag.
    summary: "Role list.",
    produce: ["application/json"],
    parameters: [], // expected params.
    // expected responses
    responses: {
      // response code
      200: {
        // response desc.
        description: "Role List were obtained",
        content: {
          // content-type
          "application/json": {
            // response model
            schema: {
              $ref: "#/components/schemas/Response",
            },
          },
        },
      },
    },
  },
};

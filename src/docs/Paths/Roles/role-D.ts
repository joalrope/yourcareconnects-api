export const roleD = {
  get: {
    tags: ["Roles"],
    summary: "Get a role data by id",
    security: [
      {
        bearerAuth: [],
      },
    ],
    produce: ["application/json"],
    parameters: [
      {
        name: "id",
        in: "path",
        type: "string",
        format: "MongoDB Id",
        required: true,
      },
    ],
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
    },
  },
  delete: {
    tags: ["Roles"],
    summary: "Soft delete a role.",
    security: [
      {
        bearerAuth: [],
      },
    ],
    produce: ["application/json"],
    parameters: [
      {
        name: "id",
        in: "path",
        type: "string",
        format: "MongoDB Id",
        required: true,
      },
    ],
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
    },
  },
};

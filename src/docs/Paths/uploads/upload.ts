export const upload = {
  post: {
    tags: ["Upload"],
    summary: "Upload an image to be published in a post.",
    security: [
      {
        bearerAuth: [],
      },
    ],
    consumes: ["multipart/form-data"],
    produce: ["application/json"],
    parameters: [],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              fileName: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
    responses: {
      "200": {
        description: "A social network post object.",
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
};

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevTinder API's",
      version: "1.0.0",
      description: "This is the documentation of my Node.js APIs",
    },
    servers: [
      {
        url: "http://localhost:7777", 
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API docs (your route files)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };

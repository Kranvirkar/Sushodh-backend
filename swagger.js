// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sushodh Edutech API",
            version: "1.0.0",
            description: "A simple Express API",
        },
        servers: [{ url: "http://localhost:3001" }],
    },
    apis: ["./routes/*.js"], // Swagger docs location
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };

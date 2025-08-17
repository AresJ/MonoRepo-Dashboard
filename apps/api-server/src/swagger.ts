import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";


const options = {
    definition: {
        openapi: "3.0.0",
        info: { title: "MonoRepo Dashboard API", version: "1.0.0" , description: "API Documentation for the Dashboard Toolkit"},
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Local Development Server"
            }
        ]
    },
    apis: ["./src/routes/*.ts"], // Path to your route files
};

export const specs = swaggerJsdoc(options);
export const swaggerUIServer = swaggerUi.serve;
export const swaggerUISetup = swaggerUi.setup(specs);
export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});
  
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import { logger } from "./middleware/logger";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { PORT, HOST } from "./config/env";
import { apiRateLimiter } from "./middleware/rateLimiter";
import router from "./routes";
import { setupSwagger } from "./swagger";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api", apiRateLimiter, router);

app.use(notFound);
app.use(errorHandler);

setupSwagger(app);

app.listen(port, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
  });
  
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
  });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usersRoutes from "./routes/users"; 
import { logger } from "./middleware/logger";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000 

app.use(cors());
app.use(express.json());
app.use(logger); // 🔷 Log requests - moved before routes

app.use("/api/users", usersRoutes);

app.use(notFound); // 🔷 Handle 404
app.use(errorHandler); // 🔷 Handle errors

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users"; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000 

app.use(cors());
app.use(express.json());
app.use("/api/users", usersRoutes);

app.get("/api/users/test", (req, res) => {
    res.json({ message: "Users route is working"});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

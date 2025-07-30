import { Router } from "express";
import usersRoutes from "./users";

const router = Router();

console.log("Users routes loaded");
router.use("/api/users", usersRoutes);

export default router;
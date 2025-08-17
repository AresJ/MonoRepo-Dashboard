import { Router } from "express";
import usersRoutes from "./users";
import authRoutes from "./auth";
import dataRoutes from "./data";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/data", dataRoutes);

export default router;  
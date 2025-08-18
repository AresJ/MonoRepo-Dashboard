import { Router } from "express";
import usersRoutes from "./users";
import authRoutes from "./auth";
import dataRoutes from "./data";
import claimsRoutes from "./claims";
import policiesRoutes from "./policies";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/data", dataRoutes);
router.use("/claims", claimsRoutes);
router.use("/policies", policiesRoutes);

export default router;  
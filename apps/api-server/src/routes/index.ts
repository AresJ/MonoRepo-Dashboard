import { Router } from "express";
import usersRoutes from "./users";

const router = Router();

router.use("/api/users", usersRoutes);

export default router;
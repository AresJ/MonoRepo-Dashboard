import { Router } from "express";
import { createUser, updateUser, deleteUser, getUserById } from '../controllers/usersController'
import { validateResource } from "../middleware/validateRescoure";
import { createUserSchema, updateUserSchema, getUserSchema, deleteUserSchema } from "../validation/userSchema";

const usersRoutes = Router();

usersRoutes.get("/:id", validateResource(getUserSchema), getUserById);
usersRoutes.post("/", validateResource(createUserSchema), createUser);
usersRoutes.put("/:id", validateResource(updateUserSchema), updateUser);
usersRoutes.delete("/:id", validateResource(deleteUserSchema), deleteUser);

export default usersRoutes;
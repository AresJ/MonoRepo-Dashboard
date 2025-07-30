import { Router } from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/usersController'

const usersRoutes = Router();

usersRoutes.get("/", getAllUsers);
usersRoutes.post("/", createUser);
usersRoutes.put("/:id", updateUser);
usersRoutes.delete("/:id", deleteUser);

export default usersRoutes;
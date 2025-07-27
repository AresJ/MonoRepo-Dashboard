import { Router } from "express";
import { getAllUsers } from '../controllers/usersController'

const usersRoutes = Router();

usersRoutes.get("/", getAllUsers);

export default usersRoutes;
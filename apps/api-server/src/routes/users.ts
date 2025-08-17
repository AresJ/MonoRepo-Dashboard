import { Router } from "express";
import { createUser, updateUser, deleteUser, getUserById, getAllUsers } from '../controllers/usersController'
import { validateResource } from "../middleware/validateRescoure";
import { createUserSchema, updateUserSchema, getUserSchema, deleteUserSchema } from "../validation/userSchema";
import { apiRateLimiter } from "../middleware/rateLimiter";

const usersRoutes = Router();

/**
 * @openapi
 * /users:
 *  get:
 *    summary: Get all users
 *    tags:
 *      - Users
 *    responses:
 *      200:
 *        description: A list of users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
    *            schema:
    *              type: object
    *              properties:
 *                success:
 *                  type: boolean
 *                  description: Whether the request was successful
 *                message:
 *                  type: string
 *                  description: A message describing the result of the request
 *                data:
 *                  type: array
 *                  description: The list of users
 *                  items:
 *                    $ref: '#/components/schemas/User'
 *      404:
 *        description: No users found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: Whether the request was successful
 *                message:
 *                  type: string
 *                  description: A message describing the result of the request
 *                data:
 *                  type: array
 *                  description: The list of users
 *                  items:
 *                    $ref: '#/components/schemas/User'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: Whether the request was successful
 *                message:
 *                  type: string
 *                  description: A message describing the result of the request
 *                data:
 *                  type: array
 *                  description: The list of users
 *                  items:
 *                    $ref: '#/components/schemas/User'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 */

usersRoutes.get("/", apiRateLimiter, getAllUsers);
usersRoutes.get("/:id", validateResource(getUserSchema), getUserById);
usersRoutes.post("/", validateResource(createUserSchema), createUser);
usersRoutes.put("/:id", validateResource(updateUserSchema), updateUser);
usersRoutes.delete("/:id", validateResource(deleteUserSchema), deleteUser);

export default usersRoutes;

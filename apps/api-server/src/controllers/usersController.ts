import { Request, Response } from "express";
import prisma from "../prisma";

// GET: return all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// GET: return a single user by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        
        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
};

// POST: create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }
    const newUser = await prisma.user.create({
        data: {name, email},
        });
    res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};

// PUT: update an existing user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);  
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });   
        }
        
        //Validate user exists
        if(isNaN(userId) || userId <= 0) {  
            return res.status(400).json({ message: "Invalid user ID" });
        }
        
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, email },
        });
        res.json(updatedUser);
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === "P2025") {
            return res.status(404).json({ message: "User not found" });
        }
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};


// DELETE: delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userID = parseInt(req.params.id);

        await prisma.user.delete({
            where: { id: userID },
        });
        res.json({ message: "User deleted successfully" });
    }catch(error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === "P2025") {
            return res.status(404).json({ message: "User not found" });
        }
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};
import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient as Prisma } from "../generated/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { JWT_SECRET } from "../config/env"; // Make sure this is set in .env file
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const prisma = new Prisma();

//Validation schema for user registration
const userRegistrationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    name: z.string().min(2, "Name must be at least 2 characters long"),
});


//Register route
router.post("/register", async (req, res) => {
    try {
        const parsedBody = userRegistrationSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: "Invalid request body" });
        }
        const { email, password, name } = parsedBody.data;
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Email, password, and name are required" });
        }

        //Check if user already exists
        const existingUser = await prisma.user.findUnique({where: { email },});
        if(existingUser) {
            return res.status(409).json({ error: "Email already in use"});
        }

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create the user
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });

        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

//Login route 
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ error: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({where: { email },});
        if(!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET as string, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Protected route
router.get("/protected", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try{
        const user = await prisma.user.findUnique({where: {id: req.user?.userId}, select: {id: true, email: true, name: true, createdAt: true, updatedAt: true}});
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Access granted", user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
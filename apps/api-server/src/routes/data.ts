import { Router } from "express";
import { apiRateLimiter } from "../middleware/rateLimiter";
import { prisma } from "../prisma"; // Adjust the import path as necessary

const router = Router();

router.get("/", apiRateLimiter, async (req, res) => {
    try {
        const { limit = "10", offset = "10", search = "" } = req. query;

        // Convert query params to numbers

            const data = await prisma.user.findMany({
                where: search ? { name: { contains: search as string, mode: "insensitive" } } : {},
                skip: Number(offset),
                take: Number(limit),
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                }
            });

            res.json({ success: true, data });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ success: false, message: "Failed to fetch data" });
        };
    }); 

export default router;
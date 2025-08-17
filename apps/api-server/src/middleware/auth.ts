import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

//Extend the request interface to include user information
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer token

    if (!token) {
        res.status(401).json({ error: "Access token required" });
        return;
    }

    jwt.verify(token, JWT_SECRET as jwt.Secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
        (req as AuthenticatedRequest).user = decoded as { userId: string; email: string };
        next();
    });
};
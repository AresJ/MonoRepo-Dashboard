import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";    

export const validateResource = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    console.log("Middleware executed, validating request body");
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e) {
        console.log("Validation Middleware caught error:", e);
        if(e instanceof z.ZodError) {
            return res.status(400).json({ 
                success: false,
                message: "Validation failed",
                errors: e.issues,
            });
        }
        next(e); // 🔷 Pass error to error handler
    }
};
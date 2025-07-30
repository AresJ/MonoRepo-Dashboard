import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

function isError(error: unknown): error is Error {
    return error instanceof Error;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, next?: NextFunction) => {
    // 🔷 Log the error
    console.error("Global Error Handler caught error:", err);

    if(isError(err instanceof ZodError)) {
        const e = err as ZodError;

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: e.issues,
        });
    }
    // 🔷 Send error response
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
   });
};
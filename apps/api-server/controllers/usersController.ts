import { Request, Response } from "express";

export const getAllUsers = (req: Request, res: Response) => {
    res.json([
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
        },
        {
            id: 2,
            name: "Jane Doe",
            email: "jane.doe@example.com",
        },
    ]);
};  
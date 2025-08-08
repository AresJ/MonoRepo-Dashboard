import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
});

export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
});

export const getUserSchema = z.object({
    params: z.object({
        id: z.string().uuid({ message: "Invalid user ID format" }),
    }),
});

export const deleteUserSchema = z.object({
    params: z.object({
        id: z.string().uuid({ message: "Invalid user ID format" }),
    }),
});
export type GetUser = z.infer<typeof getUserSchema>;
export type DeleteUser = z.infer<typeof deleteUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

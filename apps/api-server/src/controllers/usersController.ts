import { Request, Response } from "express";

const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com"},
    { id: 2, name: "Jane Doe", email: "jane.doe@example.com"},
];

const safeUpdate = (newValue: string | undefined, oldValue: string) => 
    newValue && newValue.trim() !== ""? newValue : oldValue

// GET: return all users
export const getAllUsers = (req: Request, res: Response) => {
res.json(users);
};

// POST: create a new user
export const createUser = (req: Request, res: Response) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
};

// PUT: update an existing user
export const updateUser = (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);  
    
    //Validate user exists
    if(isNaN(userId) || userId <= 0) {  
        return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find User
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    // Get Data
    const { name, email } = req.body;

    //Update user
    users[userIndex].name = safeUpdate(name, users[userIndex].name);
    users[userIndex].email = safeUpdate(email, users[userIndex].email);

    // Return updated user
    res.json(users[userIndex]);
};

// DELETE: delete a user by ID
export const deleteUser = (req: Request, res: Response) => {
    const usesrID = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === usesrID);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    } 
    const deletedUser = users.splice(userIndex, 1);
    res.json({ message: "User deleted successfully", user: deletedUser[0]});
};
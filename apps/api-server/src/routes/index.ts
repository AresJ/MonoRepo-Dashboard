import { Router } from "express";


const router = Router();

router.get("/users", (_req, res) => {
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
});

export default router;
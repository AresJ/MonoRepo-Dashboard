export const userSchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string", format: "password" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "name", "email", "password", "createdAt", "updatedAt"],
    additionalProperties: false,
    example: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        createdAt: "2021-01-01T00:00:00Z",
        updatedAt: "2021-01-01T00:00:00Z",
    },
};
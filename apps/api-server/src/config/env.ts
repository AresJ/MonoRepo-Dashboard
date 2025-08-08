import dotenv from "dotenv";

dotenv.config();

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }

    //In production, force explicit values (no defaults)
    if (process.env.NODE_ENV === "production" && !defaultValue && process.env[key] === undefined){
        throw new Error(`Environment variable ${key} is not set in production`);
    }
    return value;
}

export const PORT = getEnvVar("PORT", "3000");
export const HOST = getEnvVar("HOST", "localhost");
export const JWT_SECRET = getEnvVar("JWT_SECRET");
export const DATABASE_URL = getEnvVar("DATABASE_URL");



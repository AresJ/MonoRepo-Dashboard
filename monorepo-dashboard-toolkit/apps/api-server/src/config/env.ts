import dotenv from "dotenv";

dotenv.config();

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    
    // If value exists, return it
    if (value) {
        return value;
    }
    
    // If no value but default exists, return default
    if (defaultValue) {
        return defaultValue;
    }
    
    // In production, force explicit values (no defaults)
    if (process.env.NODE_ENV === "production") {
        throw new Error(`Environment variable ${key} is not set in production`);
    }
    
    // If no value and no default, throw error
    throw new Error(`Environment variable ${key} is not set`);
}

export const PORT = getEnvVar("PORT", "3000");
export const HOST = getEnvVar("HOST", "localhost");
export const JWT_SECRET = getEnvVar("JWT_SECRET");
export const DATABASE_URL = getEnvVar("DATABASE_URL");

import { PrismaClient } from "./generated/prisma";

declare global {
    var __prisma_client__: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma_client__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.__prisma_client__ = prisma;
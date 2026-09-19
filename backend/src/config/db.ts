import { env } from "./env.js";
import { PrismaClient } from "@prisma/client/extension";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

// Store instance on globalThis only in development mode
if (env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}

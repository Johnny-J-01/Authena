import z, { url } from 'zod'; 
import "dotenv/config"; 

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.url(),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
}); 

export const env = envSchema.parse(process.env); 
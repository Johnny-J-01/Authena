import z from 'zod'; 

export const registerSchema = z.object({
    username: z.string(), 
    email: z.email("Invalid email format"), 
    password: z.string("password is required")
}); 

export const loginSchema = z.object({
    email: z.email("Invalid email format"), 
    password: z.string("password is required")
}); 


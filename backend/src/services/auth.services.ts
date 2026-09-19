import { findUserByEmail, createUser } from "../repositories/user.repositories.js";
import { hashPassword } from "../utils/password.utils.js";
import type { User } from "@prisma/client";

export const registerUser = async (data: { username: string; email: string; password: string }): Promise<Omit<User, "passwordHash">> => {
    try {
        const result = await findUserByEmail(data.email);
        if (result !== null) {
            throw new Error("Email already registered");
        }
        const hashedPassword = await hashPassword(data.password);
        const createUserResult = await createUser({
            username: data.username, 
            email: data.email,
            passwordHash: hashedPassword,
        });

        const { passwordHash: _, ...userWithoutPassword } = createUserResult;
        return userWithoutPassword;
    } catch (error) {
        throw error;
    }
};
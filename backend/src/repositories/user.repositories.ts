import type { User } from "@prisma/client";
import { db } from "../config/db.js";
import { hashPassword } from "../utils/password.utils.js";

export const findUserByEmail = async (email: string) => { 
    const result = await db.user.findUnique({
        where: {email}
    })
    return result; 
}

export const createUser = async (data: {username: string, email: string, passwordHash: string}) => {
    const result = await db.user.create({
        data: data
    })
    return result; 
}

export const findUserById = async (userId: number) : Promise<User | null> => {
    const result = await db.user.findUnique({
        where: {
            id: userId, 
        }
    }); 
    return result;
}

export const enableUser2FA = async (userId: number, secret: string, hashedBackupCodes: string[]): Promise<User> => {
    return db.user.update({
        where: { id: userId },
        data: {
            isTwoFactorEnabled: true,
            twoFactorSecret: secret,
            backupCodes: hashedBackupCodes,
        },
    });
};


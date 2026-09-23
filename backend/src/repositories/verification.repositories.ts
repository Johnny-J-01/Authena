import { VerificationType, type RefreshToken, type User, type VerificationToken } from "@prisma/client";
import { db } from "../config/db.js";

interface verificationDataSchema {
    userId: number, 
    tokenHash: string, 
    type: VerificationType, 
    expiresAt: Date, 
}

export const createVerificationToken = async (verificationData: verificationDataSchema) => {
    const result = await db.verificationToken.create({
        data: verificationData,
    }); 
    return result; 
}

export const findVerificationTokenByHash = async (tokenHash: string) : Promise<VerificationToken | null> => {
    const result = await db.verificationToken.findFirst({
        where: {
            tokenHash
        }
    })
    return result; 
}

export const markVerificationTokenUsed = async (tokenId: number) : Promise<VerificationToken> => {
    const result = await db.verificationToken.update({
        where: {
            id: tokenId, 
        }, 
        data: {
            usedAt: new Date()
        }
    })
    return result; 
}

export const updateUserEmailVerified = async (userId: number) : Promise<User> => {
    const result = await db.user.update({
        where: {
            id: userId,
        }, 
        data: {
            isEmailVerified: true 
        }
    }) 
    return result; 
}

export const updateUserPassword = async (userId: number, passwordHash: string): Promise<User> => {
    const result = await db.user.update({
        where: {
            id: userId, 
        }, 
        data: {
            passwordHash: passwordHash,
        }
    })
    return result; 
} 

export const revokeAllUserRefreshTokens = async (userId: number) => {
    const result = await db.refreshToken.updateMany({
        where: {
            userId: userId, 
            revokedAt: null,
        }, 
        data: {
            revokedAt: new Date()
        }
    }); 
    return result; 
}


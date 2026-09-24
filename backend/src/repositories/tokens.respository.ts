import type { RefreshToken } from '@prisma/client';
import { db } from '../config/db.js'; 

interface refreshTokenSchema {
    userId: number, 
    tokenHash: string, 
    expiresAt: Date, 
    createdByIp: string
}

export const createRefreshTokenRecord = async (refreshData: refreshTokenSchema) : Promise<RefreshToken> => {
    return db.refreshToken.create({ data: refreshData }); 
}  

export const findRefreshTokenByHash = async (tokenHash: string) : Promise<RefreshToken | null> => {
    const result = await db.refreshToken.findFirst({
        where: {
            tokenHash: tokenHash,
        }
    }); 
    return result; 
}

export const revokeRefreshToken = async (tokenId: number) : Promise<RefreshToken> => {
    const result = await db.refreshToken.update({
        where: {
            id: tokenId,
        }, 
        data: {
            revokedAt: new Date() 
        }
    }); 
    return result; 
}

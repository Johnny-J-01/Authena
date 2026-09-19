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



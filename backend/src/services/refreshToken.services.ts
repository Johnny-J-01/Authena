import { createRefreshTokenRecord, findRefreshTokenByHash, revokeRefreshToken } from "../repositories/tokens.respository.js";
import { findUserByEmail, findUserById } from "../repositories/user.repositories.js";
import { revokeAllUserRefreshTokens } from "../repositories/verification.repositories.js";
import { generateRefreshToken, hashToken, signAccessToken } from "../utils/tokens.utils.js";

export const refreshTokenService = async (token: string) : Promise<{status: string, message: string, accessToken?: string, refreshToken?: string}> => {
    try {
        if (!token || typeof token !== "string") {
            return {
                status: "Fail", 
                message: "If refresh token is valid, new refresh and access token has been sent" 
            }
        } 
        const hashedRefreshToken = hashToken(token); 
        const savedRefreshToken = await findRefreshTokenByHash(token);
        if (savedRefreshToken === null) {
            return { 
                status: "Fail", 
                message: "If refresh token is valid, new refresh and access token has been sent", 
            }
        }

        if (savedRefreshToken.revokedAt !== null) {
            const result = await revokeAllUserRefreshTokens(savedRefreshToken.userId); 
            return { 
                status: "Fail", 
                message: "If refresh token is valid, new refresh and access token has been sent", 
            }
        }

        if (savedRefreshToken.expiresAt < new Date()) {
            const result = await revokeRefreshToken(savedRefreshToken.id); 
            return { 
                status: "Fail", 
                message: "If refresh token is valid, new refresh and access token has been sent", 
            }
        }

        const result = await revokeRefreshToken(savedRefreshToken.id); 
        const newRefreshToken = generateRefreshToken(); 
        const newRefreshTokenHash = hashToken(newRefreshToken); 

        const newRefreshTokenData = {
            userId: savedRefreshToken.userId, 
            tokenHash: newRefreshTokenHash, 
            expiresAt: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
            createdByIp: savedRefreshToken.createdByIp 
        }

        const createNewRefreshTokenResult = await createRefreshTokenRecord(newRefreshTokenData); 
        const userRecord = await findUserById(savedRefreshToken.userId); 
        const newAccessToken = await signAccessToken({
            userId: savedRefreshToken.userId, 
            role: userRecord?.role,   
        }); 


        return {
            status: "success", 
            message: "If refresh token is valid, new refresh and access token has been sent", 
            accessToken: newAccessToken, 
            refreshToken: newRefreshToken
        }
    }
    catch (error) {
        throw error;
    }
}
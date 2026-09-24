import { VerificationType } from "@prisma/client";
import { findVerificationTokenByHash, markVerificationTokenUsed, revokeAllUserRefreshTokens, updateUserPassword } from "../repositories/verification.repositories.js";
import { hashToken } from "../utils/tokens.utils.js"
import { hashPassword } from "../utils/password.utils.js";

export const resetPassword = async (data: {token: string, password: string}) : Promise< {status: string, message : string } > => {
    const hashedToken = hashToken(data.token); 
    const result = await findVerificationTokenByHash(hashedToken); 
    if (result === null || result.usedAt !== null || result.type !== VerificationType.PASSWORD_RESET || result.expiresAt < new Date()) {
        throw new Error ("Reset password link has expired"); 
    }

    const hashedPassword = await hashPassword(data.password); 
    const updatePasswordResult = await updateUserPassword(result.userId, hashedPassword); 
    const markVerificationTokenUsedResult = await markVerificationTokenUsed(result.id); 
    const revokeAllUserRefreshTokensResult = await revokeAllUserRefreshTokens(result.userId);

    return {
        status: "success", 
        message: "Password updated Successfully"
    }
} 
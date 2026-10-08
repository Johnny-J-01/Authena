import { AuditLogEventType, VerificationType } from "@prisma/client";
import { findVerificationTokenByHash, markVerificationTokenUsed, revokeAllUserRefreshTokens, updateUserPassword } from "../repositories/verification.repositories.js";
import { hashToken } from "../utils/tokens.utils.js";
import { hashPassword } from "../utils/password.utils.js";
import { logAuditEvent } from "./auditLog.services.js";

export const resetPassword = async (data: {token: string, password: string, clientIp?: string}) : Promise< {status: string, message : string } > => {
    const hashedToken = hashToken(data.token); 
    const result = await findVerificationTokenByHash(hashedToken); 
    console.log("result: ", result);
    if (result === null || result.usedAt !== null || result.type !== VerificationType.PASSWORD_RESET || result.expiresAt < new Date()) {
        return {
            status: "failed", 
            message: "fail to reset the password"
        } 
    }

    console.log(data);
    const hashedPassword : string = await hashPassword(data.password); 
    console.log("hashed passwrod: ", hashedPassword);
    const updatePasswordResult = await updateUserPassword(result.userId, hashedPassword); 
    console.log("updatePassowrdRseult: ", updatePasswordResult);
    const markVerificationTokenUsedResult = await markVerificationTokenUsed(result.id); 
    const revokeAllUserRefreshTokensResult = await revokeAllUserRefreshTokens(result.userId);

    await logAuditEvent({
        userId: result.userId,
        event: AuditLogEventType.PASSWORD_RESET_COMPLETED,
        ip: data.clientIp || "127.0.0.1",
    });

    return {
        status: "success", 
        message: "Password updated Successfully"
    }
} 
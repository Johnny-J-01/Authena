import { AuditLogEventType } from "@prisma/client";
import { findVerificationTokenByHash, markVerificationTokenUsed, updateUserEmailVerified } from "../repositories/verification.repositories.js";
import { hashToken } from "../utils/tokens.utils.js";
import { logAuditEvent } from "./auditLog.services.js";

export const emailVerification = async (verificationToken: string, clientIp: string = "127.0.0.1") : Promise<{status: string, message: string}> => {
    const verificationTokenHash = hashToken(verificationToken);
    const savedVerificationToken = await findVerificationTokenByHash(verificationTokenHash);
    if (savedVerificationToken === null || savedVerificationToken.usedAt !== null || savedVerificationToken.type !== "EMAIL_VERIFICATION" || savedVerificationToken.expiresAt < new Date()) {
        throw new Error ("Invalid or expired verification token"); 
    }

    await updateUserEmailVerified(savedVerificationToken.userId); 
    await markVerificationTokenUsed(savedVerificationToken.id);

    await logAuditEvent({
        userId: savedVerificationToken.userId,
        event: AuditLogEventType.EMAIL_VERIFIED,
        ip: clientIp,
    });

    return {
        status: "success",
        message: "Email verified successfully"
    }    
}


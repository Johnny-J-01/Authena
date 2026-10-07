import { enableUser2FA } from "../repositories/user.repositories.js";
import { findVerificationTokenByHash, markVerificationTokenUsed, updateUserEmailVerified } from "../repositories/verification.repositories.js";
import { hashToken } from "../utils/tokens.utils.js";
import { generateBackupCodes, verifyTotpCode } from "../utils/totp.utils.js";

export const emailVerification = async (verificationToken: string) : Promise<{status: string, message: string}> => {
    const verificationTokenHash = hashToken(verificationToken);
    const savedVerificationToken = await findVerificationTokenByHash(verificationTokenHash);
    if (savedVerificationToken === null || savedVerificationToken.usedAt !== null || savedVerificationToken.type !== "EMAIL_VERIFICATION" || savedVerificationToken.expiresAt < new Date()) {
        throw new Error ("Invalid or expired verification token"); 
    }

    updateUserEmailVerified(savedVerificationToken.userId); 
    markVerificationTokenUsed(savedVerificationToken.id);
    return {
        status: "success",
        message: "Email verified successfully"
    }    
}


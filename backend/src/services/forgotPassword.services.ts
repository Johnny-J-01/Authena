import { findUserByEmail } from "../repositories/user.repositories.js";
import { createVerificationToken } from "../repositories/verification.repositories.js";
import { sendEmail } from "../utils/mailer.utils.js";
import { generateVerificationToken, hashToken } from "../utils/tokens.utils.js";
import { AuditLogEventType, VerificationType } from "@prisma/client";
import { logAuditEvent } from "./auditLog.services.js";

export const forgotPassword = async (email: string, clientIp: string = "127.0.0.1"): Promise<{ status: string; message: string }> => {
    try {

        const result = await findUserByEmail(email); 
        console.log("resut:", result);
        if (result === null) {
            return { status: "success", message: "If the email exists, a reset password link has been sent" }; 
        }
        const forgotPasswordToken = generateVerificationToken(); 
        const forgotPasswordTokenHash = hashToken(forgotPasswordToken); 
        console.log(forgotPasswordTokenHash);
        const forgotPasswordTokenData = {
            userId: result.id, 
            tokenHash: forgotPasswordTokenHash, 
            type: VerificationType.PASSWORD_RESET, 
            expiresAt: new Date(Date.now() + 1000 * 60 * 10)   
        }; 
        console.log(forgotPasswordTokenData);
        const storeForgotPasswordToken = await createVerificationToken(forgotPasswordTokenData);  
        console.log(storeForgotPasswordToken);
        const ResetPasswordLink = `http://localhost:3000/reset-password?token=${forgotPasswordToken}` 
        const sendEmailData = {
            to: email, 
            subject: "Reset Password Link", 
            html: `<p>Welcome! Click the link below to verify your account:</p><a href="${ResetPasswordLink}">Reset Password Link</a>`
        }
    
    
        await sendEmail(sendEmailData); 
        await logAuditEvent({
            userId: result.id,
            event: AuditLogEventType.PASSWORD_RESET_REQUESTED,
            ip: clientIp,
        });

        return {
            status: "success", 
            message: "If the email exists, a reset password link has been sent to the email"
        }
    }
    catch (error) {
        throw error;
    }
};

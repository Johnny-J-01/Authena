import { findUserByEmail } from "../repositories/user.repositories.js";
import { createVerificationToken } from "../repositories/verification.repositories.js";
import { sendEmail } from "../utils/mailer.utils.js";
import { generateVerificationToken, hashToken } from "../utils/tokens.utils.js";
import { VerificationType } from "@prisma/client";

export const forgotPassword = async (email: string): Promise<{ status: string; message: string }> => {
    const result = await findUserByEmail(email); 
    if (result === null) {
        throw new Error("If the email exists, a reset password link has been sent to the email"); 
    }
    const forgotPasswordToken = generateVerificationToken(); 
    const forgotPasswordTokenHash = hashToken(forgotPasswordToken); 
    const forgotPasswordTokenData = {
        userId: result.id, 
        tokenHash: forgotPasswordTokenHash, 
        type: VerificationType.PASSWORD_RESET, 
        expiresAt: new Date(Date.now() * 1000 * 60 * 10)   
    }; 
    const storeForgotPasswordToken = await createVerificationToken(forgotPasswordTokenData);  
    const ResetPasswordLink = `http://localhost:5173/reset-password?token=${forgotPasswordToken}` 
    const sendEmailData = {
        to: email, 
        subject: "Reset Password Link", 
        html: `<p>Welcome! Click the link below to verify your account:</p><a href="${ResetPasswordLink}">Reset Password Link</a>`
    }


    sendEmail(sendEmailData); 
    return {
        status: "success", 
        message: "If the email exists, a reset password link has been sent to the email"
    }
};

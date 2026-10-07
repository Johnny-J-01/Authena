import { enableUser2FA, findUserById } from "../repositories/user.repositories.js";
import { generateBackupCodes, generateQrCodeUrl, generateTotpSecret, verifyTotpCode } from "../utils/totp.utils.js";

export const setUp2faService = async (userId: number) => {
    try { 
        const user = await findUserById(userId);  
        if (!user) {
            throw new Error("User not found"); 
        }
        const totpSecret = generateTotpSecret(); 
        const qrCodeUrl = generateQrCodeUrl(user.email, totpSecret); 
        
        return { totpSecret, qrCodeUrl }; 
    }
    catch (error) {
        throw error; 
    }
}


export const verifySetup2faService = async (userId: number, code: string, secret: string) => {
    const isValid = await verifyTotpCode(code, secret);
    if (!isValid) {
        return { status: "failed", message: "Invalid 2FA code. Please try again." };
    }

    const { plainCodes, hashedCodes } = generateBackupCodes();

    await enableUser2FA(userId, secret, hashedCodes);

    return {
        status: "success",
        message: "2FA enabled successfully",
        backupCodes: plainCodes, 
    };
};

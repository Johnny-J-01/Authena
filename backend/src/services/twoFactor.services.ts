import { findUserById } from "../repositories/user.repositories.js";
import { generateQrCodeUrl, generateTotpSecret } from "../utils/totp.utils.js";

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


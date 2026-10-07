import { generateSecret, generateURI, verify, type VerifyResult } from "otplib";
import { toDataURL } from "qrcode";
import crypto from "node:crypto"; 
import { hashToken } from "./tokens.utils.js";

export const generateTotpSecret = () : string => {
    const secret = generateSecret(); 
    return secret;  
}  

export const generateQrCodeUrl = async (email: string, secret: string) : Promise<string> => {
    const otpAuthUrl = generateURI({issuer: "Authena", secret: secret, label: email}); 
    const QrCodeDataUrl = await toDataURL(otpAuthUrl); 
    return QrCodeDataUrl; 
}

export const verifyTotpCode = (code: string, secret: string) => {
    return verify({token: code, secret: secret}); 
} 

export const generateBackupCodes = (): { plainCodes: string[]; hashedCodes: string[] } => {
    const plainCodes: string[] = [];
    const hashedCodes: string[] = [];
    for (let i = 0; i < 8; i++) {
        const code = crypto.randomBytes(4).toString("hex"); // e.g. "a3f891b2"
        plainCodes.push(code);
        hashedCodes.push(hashToken(code));
    }
    return { plainCodes, hashedCodes };
};


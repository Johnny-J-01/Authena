import { createRefreshTokenRecord } from "../repositories/tokens.respository.js";
import { enableUser2FA, findUserById } from "../repositories/user.repositories.js";
import { generateRefreshToken, hashToken, signAccessToken, verifyTemp2faToken } from "../utils/tokens.utils.js";
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

export const verifyLogin2faService = async (tempToken: string, code: string, clientIp: string) => {
    // 1. Verify tempToken to extract userId
    const decoded = verifyTemp2faToken(tempToken);
    if (!decoded) return { status: "failed", message: "Invalid or expired session. Please log in again." };

    // 2. Fetch user & confirm 2FA is actually enabled
    const user = await findUserById(decoded.userId);
    if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret)
        return { status: "failed", message: "Invalid 2FA state" };

    // 3. Verify the 6-digit TOTP code
    const isValid = await verifyTotpCode(code, user.twoFactorSecret);
    if (!isValid) return { status: "failed", message: "Invalid 2FA code" };

    // 4. BOTH factors verified — NOW issue tokens
    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken();
    await createRefreshTokenRecord({
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        createdByIp: clientIp,
    });

    const { passwordHash: _, twoFactorSecret: __, backupCodes: ___, ...safeUser } = user;
    return { status: "success", accessToken, refreshToken, user: safeUser };
};

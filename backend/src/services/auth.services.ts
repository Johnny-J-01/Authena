import { findUserByEmail, createUser } from "../repositories/user.repositories.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { VerificationType, type User } from "@prisma/client";
import type { RefreshToken } from "@prisma/client";
import { generateRefreshToken, generateVerificationToken, hashToken, signAccessToken } from "../utils/tokens.utils.js";
import { createRefreshTokenRecord, findRefreshTokenByHash, revokeRefreshToken } from "../repositories/tokens.respository.js";
import { createVerificationToken, revokeAllUserRefreshTokens } from "../repositories/verification.repositories.js";
import { sendEmail } from "../utils/mailer.utils.js";

export const registerUser = async (data: { username: string; email: string; password: string }): Promise<Omit<User, "passwordHash">> => {
    try {
        const result = await findUserByEmail(data.email);
        if (result !== null) {
            throw new Error("Email already registered");
        }
        const hashedPassword = await hashPassword(data.password);
        const createUserResult = await createUser({
            username: data.username,
            email: data.email,
            passwordHash: hashedPassword,
        });

        const emailVerificationToken = generateVerificationToken();
        const emailVerificationTokenHash = hashToken(emailVerificationToken);
        const emailVerificationTokenData = {
            userId: createUserResult.id,
            tokenHash: emailVerificationTokenHash,
            type: VerificationType.EMAIL_VERIFICATION,
            expiresAt: new Date(Date.now() + 60 * 10 * 1000),
        };

        const storeEmailVerificationToken = await createVerificationToken(emailVerificationTokenData);
        const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}`;
        const sendEmailMetaData = {
            to: createUserResult.email,
            subject: "Email verification link",
            html: `<p>Welcome! Click the link below to verify your account:</p><a href="${verificationLink}">${verificationLink}</a>`,
        };

        sendEmail(sendEmailMetaData);

        const { passwordHash: _, ...userWithoutPassword } = createUserResult;
        return userWithoutPassword;
    } catch (error) {
        throw error;
    }
};

interface loginDataSchema {
    email: string;
    password: string;
    clientIp: string;
}
export const loginUser = async (data: loginDataSchema): Promise<{ user: Omit<User, "passwordHash">; accessToken: string; refreshToken: string }> => {
    try {
        const existUserResult = await findUserByEmail(data.email);
        if (existUserResult === null) {
            throw new Error("Invalid Email or password");
        }
        const verifyPasswordResult = await verifyPassword(existUserResult.passwordHash, data.password);
        if (verifyPasswordResult === false) {
            throw new Error("Invalid email or password");
        }

        const accessToken = signAccessToken({ userId: existUserResult.id, role: existUserResult.role });
        const refreshToken = generateRefreshToken();
        const hashedRefreshToken = hashToken(refreshToken);
        const expiresAt: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        const createRefreshTokenResult = await createRefreshTokenRecord({
            userId: existUserResult.id,
            tokenHash: hashedRefreshToken,
            expiresAt: expiresAt,
            createdByIp: data.clientIp,
        });

        console.log(`The refreshToken record has been created, the data is : ${createRefreshTokenResult}`);

        const destructuredUserPasswordHash = {
            id: existUserResult.id,
            username: existUserResult.username,
            email: existUserResult.email,
            isEmailVerified: existUserResult.isEmailVerified,
            role: existUserResult.role,
            createdAt: existUserResult.createdAt,
            updatedAt: existUserResult.updatedAt,
        };
        return {
            user: destructuredUserPasswordHash,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async (token: string) => {
    try {
        const hashedRefreshToken = hashToken(token); 
        const isVerifyRefreshToken = await findRefreshTokenByHash(hashedRefreshToken); 
        if (isVerifyRefreshToken === null) {
            throw new Error("Failed to logout"); 
        }
        const revokeRefreshTokenResult = await revokeRefreshToken(isVerifyRefreshToken.id); 
        return {
            status: "success"
        }
    }
    catch (error) {
        throw error; 
    }
}
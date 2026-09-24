import type { NextFunction, Request, Response } from "express";
import { hashToken } from "../utils/tokens.utils.js";
import { findVerificationTokenByHash, markVerificationTokenUsed, updateUserEmailVerified } from "../repositories/verification.repositories.js";
import { emailVerification } from "../services/verification.services.js";

export const emailVerificationController = async (request: Request, response: Response, next: NextFunction) => {
    try { 
        const verificationToken = request.query['token-hash']; 
        if (!verificationToken || typeof verificationToken !== "string") {
            response.status(400).json({ status: "fail", message: "Token is missing or invalid" });
            return;
        }
        const result = await emailVerification(verificationToken); 
        if (result.status !== 'success') {
            response.status(400).json({
                status: "fail", 
                message: "Email Verfication failed",
            }) 
        }

        response.status(200).json({
            status: "success", 
            message: "Email verification successfull"
        })
    }
    catch (error) {
        response.status(404).json({
            status: "fail", 
            message: "Email verification failed"
        })
    }
};

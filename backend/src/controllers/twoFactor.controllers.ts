import type { NextFunction, Request, Response } from "express";
import { setUp2faService, verifyLogin2faService, verifySetup2faService,} from "../services/twoFactor.services.js";
import { env } from "../config/env.js";

export const setUp2faController = async (request: Request, response: Response, next: NextFunction) : Promise<void> => {
    try {
        const userId = request.user?.userId; 
        const setUp2faServiceResult = await setUp2faService(userId!); 
        response.status(200).json({
            status: "success", 
            data: setUp2faServiceResult
        }); 
    }
    catch (error) {
        next(error); 
    }
}

export const verifySetup2faController = async (request: Request, response: Response, next: NextFunction) => {
    try { 
        const userId = request.user!.userId;
        const { code, secret } = request.body;
        const result = await verifySetup2faService(userId, code, secret);
        if (result.status === "failed") {
            response.status(400).json(result);
            return;
        }
        response.status(200).json(result);
    }
    catch (error) {
        next(error); 
    }
}

export const verifyLogin2faController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { tempToken, code } = req.body;
        const clientIp = req.ip || "127.0.0.1";
        const result = await verifyLogin2faService(tempToken, code, clientIp);

        if (result.status === "failed") {
            res.status(400).json(result);
            return;
        }

        res.cookie("refreshToken", result.refreshToken!, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: "/api/auth",
        });

        res.status(200).json({
            status: "success",
            message: "2FA authentication successful",
            data: { user: result.user, accessToken: result.accessToken },
        });
    } catch (error) { next(error); }
};

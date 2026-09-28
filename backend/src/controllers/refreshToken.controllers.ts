import type { NextFunction, Request, Response } from "express";
import { refreshTokenService } from "../services/refreshToken.services.js";
import strict from "assert/strict";
import { env } from "../config/env.js";

export const refreshTokenController = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const refreshToken = request.cookies.refreshToken;
        const refreshTokenServiceResult = await refreshTokenService(refreshToken);
        if (refreshTokenServiceResult.status !== "success") {
            response.status(401).json({
                status: refreshTokenServiceResult.status,
                message: refreshTokenServiceResult.message,
            });
            return;
        }

        response.cookie("refreshToken", refreshTokenServiceResult.refreshToken!, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7 * 1000,
            path: "/api/auth",
        });

        response.status(200).json({
            status: "success",
            message: "refresh and access token rotated",
            data: {
                accessToken: refreshTokenServiceResult.accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

import type { NextFunction, Request, Response } from "express";
import { resetPassword } from "../services/resetPassword.services.js";

export const resetPasswordController = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const result = request.body;
        const token = request.query["token"];
        if (!token || typeof token !== "string") {
            response.status(400).json({ status: "fail", message: "Token is missing or invalid" });
            return;
        }
        if (!token || !result) {
            response.status(404).json({
                status: "Fail",
                message: "Invalid token or token has been expired",
            });
        }

        console.log(result);
        const password = result.password;
        const resetPasswordResult = await resetPassword({ token, password});
        if (resetPasswordResult.status !== "success") {
            response.status(400).json(resetPasswordResult);
        }
        response.status(200).json(resetPasswordResult);
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: "Failed to reset the password",
        });
    }
};

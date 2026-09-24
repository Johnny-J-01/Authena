import type { NextFunction, Request, Response } from "express";
import { resetPassword } from "../services/resetPassword.services.js";

export const resetPasswordController = async (request: Request, response: Response, next: NextFunction) : Promise <void> => {
    try {
        const password = request.body; 
        const token : string = request.query["token"]; 

        if (!token || !password) {
            response.status(404).json({
                status: "Fail", 
                message: "Invalid token or token has been expired"
            })
        }

        const resetPasswordResult = await resetPassword({token, password}); 
        if (resetPasswordResult.status !== "success") {
            response.status(400).json(resetPasswordResult); 
        }
        response.status(400).json(resetPasswordResult); 
    }
    catch (error) {
        response.status(400).json({
            status: "Fail",
            message: "Failed to reset the password"
        })
    }
}
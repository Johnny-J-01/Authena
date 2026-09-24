import type { NextFunction, Request, Response } from "express";
import { forgotPassword } from "../services/forgotPassword.services.js";

export const forgotPasswordController = async (request: Request, response: Response, next: NextFunction) : Promise <void> => {
    try { 
        const email = request.body; 
        console.log("forgot password email data: ", email);
        const forgotPasswordServiceResult = await forgotPassword(email);
        if (forgotPasswordServiceResult.status !== "success") {
            response.status(404).json(forgotPasswordServiceResult); 
        }  
        response.status(200).json(forgotPasswordServiceResult); 
    }
    catch (error) {
        response.status(400).json({
            status: "Fail", 
            message: "Failed to reset password"
        })
    } 
}
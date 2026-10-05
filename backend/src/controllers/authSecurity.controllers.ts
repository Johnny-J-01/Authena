import type { NextFunction, Request, Response } from "express";
import { findUserById } from "../repositories/user.repositories.js";

export const getMeController = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try { 
        const userId = request.user?.userId;  
        if (!userId) {
            response.status(401).json({
                status: "failed",
                message: "Unauthorized"
            });
            return;
        }

        const result = await findUserById(userId); 
        if (result === null) {
            response.status(404).json({
                status: "failed",
                message: "User not found"
            });
            return;
        }

        const { passwordHash: _, ...userWithoutPassword } = result;

        response.status(200).json({
            status: "success", 
            data: {
                user: userWithoutPassword
            }
        }); 
    }
    catch (error) {
        next(error); 
    }
};
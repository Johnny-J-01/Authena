import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/tokens.utils.js";

export const authenticateTokenMiddleWare = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const authHeader = request.headers.authorization;
        console.log("authHeader", authHeader);
    
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            if (token === null) {
                response.status(401).json({
                    status: "failed", 
                    message: "Unothorized"
                }); 
                return; 
            }
            const isVerifyAccessTokenResult = verifyAccessToken(token!);
            if (isVerifyAccessTokenResult === null) {
                response.status(401).json({
                    status: "failed", 
                    message: "Unauthorized"
                }); 
                return; 
            }  
            request.user = isVerifyAccessTokenResult;
            next(); 
        } 
        else {
            response.status(401).json({
                status: "failed", 
                message: "Unauthorized"
            }); 
            return;
        }
    }
    catch (error) {
        next(error);
    }
};

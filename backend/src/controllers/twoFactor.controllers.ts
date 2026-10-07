import type { NextFunction, Request, Response } from "express";
import { setUp2faService, verifySetup2faService,} from "../services/twoFactor.services.js";

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
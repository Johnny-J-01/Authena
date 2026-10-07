import type { NextFunction, Request, Response } from "express";

export const setUp2faController = async (request: Request, response: Response, next: NextFunction) : Promise<void> => {
    try {
        const userId = request.user?.userId; 
        const setUp2faServiceResult = await setUp2faService(userId); 
        response.status(200).json({
            status: "success", 
            data: setUp2faServiceResult
        }); 
    }
    catch (error) {
        next(error); 
    }
}
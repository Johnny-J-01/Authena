import type { Request, Response, NextFunction } from "express";

export const NotFoundMiddleWare = (request: Request, response: Response, next: NextFunction): void => {
    response.status(404).json({
        status: "fail",
        error: "Invalid Route",
    });
};

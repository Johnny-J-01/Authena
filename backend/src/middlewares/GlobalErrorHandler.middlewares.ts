import type { Request, Response, NextFunction } from 'express'; 
import { invalidCsrfTokenError } from './csrf.middlelwares.js';

export const GlobalErrorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(error);

    if (error === invalidCsrfTokenError) {
        response.status(403).json({
            status: "failed",
            message: "Invalid or missing CSRF token"
        });
        return;
    }

    response.status(500).json({
        status: "error", 
        error: "Internal Server Error"
    });
};

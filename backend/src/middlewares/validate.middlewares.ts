import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";

export const validateCredentials = (zodValidationSchema: ZodType) => {
    return (request: Request, response: Response, next: NextFunction): void => {
        try {
            console.log(request.body)
            zodValidationSchema.parse(request.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                response.status(400).json({
                    status: "fail",
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};


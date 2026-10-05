import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const globalAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    message: "Too many requests, please try again after 15 minutes",
    standardHeaders: "draft-7", 
    legacyHeaders: false, 
}); 

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 5, 
    handler: (request, response, next) => {
        response.status(429).json({
            status: "failed", 
            message: "Too many login attempts. Please try again after 15 minutes"
        })
    },
    standardHeaders: "draft-7", 
    legacyHeaders: false, 
})

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    limit: 3, 
    handler: (request, response, next) => {
        response.status(429).json({
            status: "failed", 
            message: "Too many account registration requests from the same IP, please try again after 60 minutes"
        })
    }, 
    standardHeaders: "draft-7", 
    legacyHeaders: false, 
})

export const sensitiveActionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    limit: 3, 
    message: "Too many requests, please try again after 60 minutes",
    standardHeaders: "draft-7", 
    legacyHeaders: false, 
}); 


import type { NextFunction, Request, Response } from "express";
import { registerUser, loginUser, logoutUser } from "../services/auth.services.js";
import { env } from "../config/env.js";
import type { PrismaPromise } from "@prisma/client";
import { generateCsrfToken } from "../middlewares/csrf.middlelwares.js";

export const registerController = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password } = request.body;
        console.log(request.body);
        const registeredUser = await registerUser({ username, email, password });
        response.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: { user: registeredUser },
        });
    } catch (error) {
        next(error);
    }
};

export const loginController = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = request.body;
        const clientIp = request.ip || "127.0.0.1";

        const loggedInResult = await loginUser({ email, password, clientIp });
        const loggedInUser = loggedInResult.user;
        const accessToken = loggedInResult.accessToken;
        const refreshToken = loggedInResult.refreshToken;
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: "/api/auth",
        });
        response.status(200).json({
            status: "success",
            message: "Logged in successfully",
            data: { user: loggedInUser, accessToken: accessToken },
        });
    } catch (error) {
        next(error);
    }
};
  
export const logoutController = async (request: Request, response: Response, next: NextFunction) : Promise<void> => {
    try {
        const token = request.cookies.refreshToken; 
        const result = await logoutUser(token); 
        if (result.status !== "success") {
            response.status(400).json({
                message: "Failed to logout"
            }); 
            return; 
        }
        response.clearCookie('refreshToken', {
            path: '/api/auth',
        }); 
        response.status(200).json({
            status: "success", 
            message: "Successfully logged out"
        }); 
    }
    catch (error) {
        next(error); 
    }
}

export const getCsrfTokenController = (request: Request, response: Response) => {
    const csrfToken = generateCsrfToken(request, response); 
    response.status(200).json({ status: "success", csrfToken });
}
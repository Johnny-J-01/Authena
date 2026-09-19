import type { NextFunction, Request, Response } from "express";
import { registerUser } from "../services/auth.services.js";

export const registerController = async (request: Request, response: Response, next: NextFunction ) : Promise<void> => { 
    try {
        const {username, email, password} = request.body;
        console.log(request.body);
        const registeredUser = await registerUser({username, email, password});
        response.status(201).json({
            status: "success", 
            message: "User registered successfully",
            data: {user: registeredUser}
        }) 
    }
    catch (error) {
        next(error); 
    }
}


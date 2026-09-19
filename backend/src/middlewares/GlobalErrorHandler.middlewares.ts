import type {Request, Response, NextFunction} from 'express'; 

export const GlobalErrorHandler = (error: Error, request : Request, response : Response, next : NextFunction) => {
    console.log(error);
    response.status(500).json({
        status: "error", 
        error: "Internal Server Error"
    })
}
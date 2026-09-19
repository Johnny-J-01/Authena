import jwt, { type JwtPayload } from 'jsonwebtoken'; 
import crypto from "node:crypto"; 
import { env } from '../config/env.js'; 

export const signAccessToken = (payload : {userId: number, role: string}) : string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m", 
        algorithm: "HS256"
    }); 
}; 


export const generateRefreshToken = () : string => {
    return crypto.randomBytes(64).toString('hex'); 
}

export const hashToken = (token: string) : string => {
    return crypto.createHash('sha256').update(token).digest('hex'); 
}

export const verifyAccessToken = (token: string) : {userId: number, role: string} | null => {
    try {
        const decodedToken = jwt.verify(token, env.JWT_ACCESS_SECRET, {
            algorithms: ["HS256"],
        }) as {userId: number, role: string};  
        return decodedToken;
    }
    catch (error) {
        return null; 
    }
}
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

export const generateVerificationToken = () : string => {
    return crypto.randomBytes(64).toString('hex'); 
}


export const signTemp2faToken = (payload: { userId: number }): string => {
    return jwt.sign(
        { ...payload, stage: "2FA_PENDING" },
        env.JWT_ACCESS_SECRET,
        { expiresIn: "5m", algorithm: "HS256" }
    );
};
export const verifyTemp2faToken = (token: string): { userId: number; stage: string } | null => {
    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
            algorithms: ["HS256"],
        }) as { userId: number; stage: string };
        if (decoded.stage !== "2FA_PENDING") return null;
        return decoded;
    } catch {
        return null;
    }
};
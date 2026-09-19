import argon2 from 'argon2'; 

export const hashPassword = async (password : string) : Promise<string> => {
    const hashedPassword = await argon2.hash(password); 
    return hashedPassword; 
}

export const verifyPassword = async (hash: string, plainText: string) : Promise<boolean> => {
    try {
        const isVerify = await argon2.verify(hash, plainText); 
        return isVerify; 
    }
    catch { 
        return false; 
    }
}
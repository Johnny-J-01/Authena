import { db } from "../config/db.js";

const findUserByEmail = async (email: string) => { 
    const result = await db.user.findUnique({
        where: {email}
    })
    return result; 
}

const createUser = async (data: {username: string, email: string, passwordHash: string}) => {
    const result = await db.user.create({
        data: data
    })
    return result; 
}

    export {findUserByEmail, createUser}; 
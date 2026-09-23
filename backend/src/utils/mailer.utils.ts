import nodemailer from "nodemailer";

const transpoter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', 
    port: 587, 
    auth: {
        user: "test_user", 
        pass: "test_pass", 
    }, 
}); 

interface sendEmailSchema {
    to: string, 
    subject: string, 
    html: string
}

export const sendEmail = async (data: sendEmailSchema) : Promise<void> => {
    console.log(`\n📧 [EMAIL SENT to ${data.to}]: ${data.subject}\n  ${data.html}`);
}; 

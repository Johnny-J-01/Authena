import express from 'express'; 
import { loginController, registerController } from '../controllers/auth.controllers.js';
import { emailVerificationController } from '../controllers/verification.controllers.js';
import { validateCredentials } from '../middlewares/validate.middlewares.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';
import { forgotPasswordController } from '../controllers/forgotPassword.controller.js';
import { resetPasswordController } from '../controllers/resetPassword.controller.js';

const router = express.Router();

router.post('/register', validateCredentials(registerSchema), registerController); 
router.post('/login', validateCredentials(loginSchema), loginController); 
router.post('/verify-email', validateCredentials(loginSchema), emailVerificationController); 
router.post('/forgot-password', validateCredentials(loginSchema), forgotPasswordController); 
router.post('/reset-password', validateCredentials(loginSchema), resetPasswordController); 

export default router; 
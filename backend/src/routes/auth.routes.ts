import express from 'express'; 
import { loginController, registerController } from '../controllers/auth.controllers.js';
import { emailVerificationController } from '../controllers/verification.controllers.js';
import { validateCredentials } from '../middlewares/validate.middlewares.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';
import { forgotPasswordController } from '../controllers/forgotPassword.controller.js';
import { resetPasswordController } from '../controllers/resetPassword.controller.js';
import { forgotPasswordSchema } from '../validators/forgotPassword.validator.js';
import { resetPasswordSchema } from '../validators/resetPassword.validator.js';
import { refreshTokenController } from '../controllers/refreshToken.controllers.js';

const router = express.Router();

router.post('/register', validateCredentials(registerSchema), registerController); 
router.post('/login', validateCredentials(loginSchema), loginController); 
router.post('/verify-email', validateCredentials(loginSchema), emailVerificationController); 
router.post('/forgot-password', validateCredentials(forgotPasswordSchema), forgotPasswordController); 
router.post('/reset-password', validateCredentials(resetPasswordSchema), resetPasswordController); 
router.post('/refresh', refreshTokenController); 

export default router; 
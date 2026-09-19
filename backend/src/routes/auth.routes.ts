import express from 'express'; 
import { loginController, registerController } from '../controllers/auth.controllers.js';
import { validateCredentials } from '../middlewares/validate.middlewares.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';

const router = express.Router();

router.post('/register', validateCredentials(registerSchema), registerController); 
router.post('/login', validateCredentials(loginSchema), loginController); 

export default router; 
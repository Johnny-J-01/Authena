import express from 'express'; 
import { registerController } from '../controllers/auth.controllers.js';
import { validateCredentials } from '../middlewares/validate.middlewares.js';
import { registerSchema } from '../validators/auth.validators.js';

const router = express.Router();

router.post('/register', validateCredentials(registerSchema), registerController); 

export default router; 
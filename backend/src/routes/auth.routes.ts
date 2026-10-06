import express from "express";
import { getCsrfTokenController, loginController, logoutController, registerController } from "../controllers/auth.controllers.js";
import { emailVerificationController } from "../controllers/verification.controllers.js";
import { validateCredentials } from "../middlewares/validate.middlewares.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";
import { forgotPasswordController } from "../controllers/forgotPassword.controller.js";
import { resetPasswordController } from "../controllers/resetPassword.controller.js";
import { forgotPasswordSchema } from "../validators/forgotPassword.validator.js";
import { resetPasswordSchema } from "../validators/resetPassword.validator.js";
import { refreshTokenController } from "../controllers/refreshToken.controllers.js";
import { authenticateTokenMiddleWare } from "../middlewares/auth.middlewares.js";
import { getMeController } from "../controllers/authSecurity.controllers.js";
import { globalAuthLimiter, loginLimiter, registerLimiter, sensitiveActionLimiter } from "../middlewares/rateLimiter.middlewares.js";
import { doubleCsrfProtection } from "../middlewares/csrf.middlelwares.js";

const router = express.Router();

router.use(globalAuthLimiter); 

router.get("/csrf-token", getCsrfTokenController);
router.use(doubleCsrfProtection); 
router.post("/register", registerLimiter, validateCredentials(registerSchema), registerController);
router.post("/login", loginLimiter, validateCredentials(loginSchema), loginController);
router.get('/me', authenticateTokenMiddleWare, getMeController); 
router.post("/logout", logoutController);
router.post("/verify-email", sensitiveActionLimiter,emailVerificationController);
router.post("/forgot-password", sensitiveActionLimiter, validateCredentials(forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", validateCredentials(resetPasswordSchema), resetPasswordController);
router.post("/refresh", refreshTokenController);

export default router;

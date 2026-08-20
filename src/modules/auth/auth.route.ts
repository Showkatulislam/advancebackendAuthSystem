import { Router } from 'express';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { authController } from './auth.controller.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);

router.post("/login",validateRequest(loginSchema),authController.login)

export default router;

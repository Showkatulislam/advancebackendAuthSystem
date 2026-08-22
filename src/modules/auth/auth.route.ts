import { Router } from 'express';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { loginSchema, refreshTokenSchema, registerSchema } from './auth.validation.js';
import { authController } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);

router.post('/login', validateRequest(loginSchema), authController.login);

router.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshAccessToken);

router.post('/logout', validateRequest(refreshTokenSchema), authController.logout);

router.post('/logout-all', authenticate, authController.logoutAll);

router.get('/sessions', authenticate, authController.getActiveSessions);

router.delete('/sessions/:sessionId', authenticate, authController.revokeSession);
export default router;

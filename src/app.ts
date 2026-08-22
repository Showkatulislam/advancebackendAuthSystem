import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middleware/global.erorr.middleware.js';
export const app = express();
import authRoutes from '../src/modules/auth/auth.route.js';
import router from './modules/user/user.route.js';
import { logger } from './lib/logger.js';
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
});

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/user', router);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is healty',
  });
});

app.use(globalErrorHandler);

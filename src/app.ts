import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { success } from 'zod';
import { globalErrorHandler } from './middleware/global.erorr.middleware.js';
export const app = express();
import authRoutes from '../src/modules/auth/auth.route.js';
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is healty',
  });
});

app.use(globalErrorHandler);

import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError.js';
import { jwtConfig } from '../config/jwt.config.js';
import { accessTokenPayloadSchema } from '../modules/auth/auth.validation.js';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, 'Authentication required.');
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new AppError(401, 'Authentication required.');
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.access.secret);

    const result = accessTokenPayloadSchema.safeParse(decoded);

    if (!result.success) {
      throw new AppError(401, 'Invalid access token.');
    }

    req.user = result.data;

    next();
  } catch (error) {
    throw new AppError(401, 'Invalid or expired access token');
  }
};

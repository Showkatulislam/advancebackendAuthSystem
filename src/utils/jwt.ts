import jwt, { Secret } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config.js';
import type { AccessTokenPayload, RefreshTokenPayload } from '../types/auth.js';
import { env } from '../config/env.js';

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, jwtConfig.access.secret as Secret, {
    expiresIn: jwtConfig.access.expiresIn as any,
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};

import { Secret, SignOptions } from 'jsonwebtoken';
import { env } from './env.js';

export const jwtConfig = {
  access: {
    secret: env.JWT_ACCESS_SECRET as Secret,
    // Assert as SignOptions['expiresIn'] so TypeScript knows it's a valid duration
    expiresIn: (env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'],
  },
};

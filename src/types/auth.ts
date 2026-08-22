import { Role } from '../generated/prisma/client.js';

export interface AccessTokenPayload {
  sub: string;
  role: Role;
}

export interface RefreshTokenPayload {
  userId: string;
  jti: string;
}

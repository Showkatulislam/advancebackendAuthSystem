import { Role } from '../../generated/prisma/enums.js';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface loginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface createRefreshTokenData {
  userId: string;
  tokenHash: string;
  jti: string;
  familyId: string;
  expiresAt: Date;

  deviceName?: string | undefined;
  userAgent?: string | undefined;
  ipAddress?: string | undefined;
}

export interface RequestMetadata {
  userAgent?: string | undefined;
  ipAddress?: string | undefined;
  deviceName?: string | undefined;
}

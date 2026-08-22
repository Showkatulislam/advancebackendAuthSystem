import { RefreshToken, User } from '../../generated/prisma/client.js';
import { createRefreshTokenData, CreateUserData } from './auth.types.js';

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User | null>;
  createRefreshToken(data: createRefreshTokenData): Promise<RefreshToken>;
  findRefreshTokenByJti(jti: string): Promise<RefreshToken | null>;
  revokeRefreshToken(id: string): Promise<RefreshToken>;
  rotateRefreshToken(data: RotateRefreshTokenData): Promise<boolean>;
  revokeTokenFamily(familyId: string): Promise<void>;
  revokeAllRefreshTokens(userId: string): Promise<void>;
  findActiveSessions(userId: string): Promise<RefreshToken[]>;
  revokeSession(sessionId: string, userId: string): Promise<boolean>;
  deleteOldRevokedRefreshTokens(retentionDays: number): Promise<number>;
  deleteExpiredRefreshTokens(): Promise<number>;
}

export interface RotateRefreshTokenData {
  userId: string;
  tokenHash: string;
  jti: string;
  familyId: string;
  expiresAt: Date;
  deviceName?: string | undefined;
  userAgent?: string | undefined;
  ipAddress?: string | undefined;
}

import {
  hashPassword,
  hashRefreshToken,
  verifyPassword,
  verifyRefreshTokenHash,
} from '../../utils/password.js';
import { AppError } from '../../utils/appError.js';
import { IAuthRepository } from './auth.interface.js';
import { authRepository } from './auth.repository.js';
import { AuthUser, CreateUserData, loginResponse, RequestMetadata } from './auth.types.js';
import { AccessTokenPayload, RefreshTokenPayload } from '../../types/auth.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { randomUUID } from 'node:crypto';
import { getRefreshTokenExpiration } from '../../utils/token.js';
import { RegisterInput } from './auth.validation.js';

class AuthService {
  constructor(private readonly repo: IAuthRepository) {}

  private createRefreshToken = (userId: string, familyId?: string) => {
    const jti = randomUUID();
    const tokenFamilyId = familyId ?? randomUUID();
    const refreshToken = generateRefreshToken({
      userId,
      jti,
    });

    return {
      refreshToken,
      jti,
      familyId: tokenFamilyId,
    };
  };
  async register(input: RegisterInput): Promise<AuthUser | null> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.repo.findByEmail(email);

    if (existingUser) {
      throw new AppError(409, 'Email Already registered.');
    }

    const passwordHash = await hashPassword(input.password);

    const userData: CreateUserData = {
      name,
      email,
      password: passwordHash,
    };

    const user = await this.repo.create(userData);

    if (user)
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

    return user;
  }

  async login(email: string, password: string, metadata: RequestMetadata): Promise<loginResponse> {
    const user = await this.repo.findByEmail(email);

    if (!user) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const isPasswordValid = await verifyPassword(user.password ?? '', password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const payload: AccessTokenPayload = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = generateAccessToken(payload);

    const { refreshToken, jti, familyId } = this.createRefreshToken(user.id);

    const tokenHash = await hashRefreshToken(refreshToken);

    const expiresAt = getRefreshTokenExpiration();

    await this.repo.createRefreshToken({
      userId: user.id,
      tokenHash,
      jti,
      familyId,
      expiresAt,

      deviceName: metadata.deviceName,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  private validateRefreshToken = async (refreshToken: string) => {
    let payload: RefreshTokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError(401, 'Invalid refresh token.');
    }

    const storedToken = await this.repo.findRefreshTokenByJti(payload.jti);

    if (!storedToken) {
      throw new AppError(401, 'Invalid refresh token');
    }

    if (storedToken.revokedAt) {
      await this.repo.revokeTokenFamily(storedToken.familyId);
      throw new AppError(401, 'Refresh token has been revoked.');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError(401, 'Refresh token has expired.');
    }

    const isValid = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);

    if (!isValid) {
      throw new AppError(401, 'Invalid refresh token');
    }

    return {
      payload,
      storedToken,
    };
  };
  async refreshAccessToken(refreshToken: string, metadata: RequestMetadata) {
    const { payload, storedToken } = await this.validateRefreshToken(refreshToken);

    const user = await this.repo.findById(payload.userId);

    if (!user) {
      throw new AppError(401, 'User no longer exists.');
    }

    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(accessTokenPayload);

    const {
      refreshToken: newRefreshToken,
      jti,
      familyId,
    } = this.createRefreshToken(user.id, storedToken.familyId);

    const tokenHash = await hashRefreshToken(newRefreshToken);

    const expiresAt = getRefreshTokenExpiration();

    const rotated = await this.repo.rotateRefreshToken({
      userId: user.id,
      tokenHash,
      jti,
      familyId,
      expiresAt,
      deviceName: metadata.deviceName,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
    });

    if (!rotated) {
      await this.repo.revokeTokenFamily(storedToken.familyId);
      throw new AppError(401, 'Refresh token reuse detected. Session revoked.');
    }

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
  async logout(refreshToken: string): Promise<void> {
    let payload: RefreshTokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError(401, 'Invalid refresh Token');
    }
    const storedToken = await this.repo.findRefreshTokenByJti(payload.jti);

    if (!storedToken) {
      throw new AppError(401, 'Invalid refresh token.');
    }

    if (storedToken.revokedAt) {
      return;
    }
    await this.repo.revokeRefreshToken(storedToken.id);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.repo.revokeAllRefreshTokens(userId);
  }
  async getActiveSessions(userId: string) {
    const sessions = await this.repo.findActiveSessions(userId);

    return sessions.map((session) => ({
      id: session.id,
      familyId: session.familyId,
      deviceName: session.deviceName,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }));
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const revoked = await this.repo.revokeSession(sessionId, userId);

    if (!revoked) {
      throw new AppError(404, 'Session not found.');
    }
  }
}

export const authService = new AuthService(authRepository);

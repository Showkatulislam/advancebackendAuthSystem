import { prisma } from '../../config/database.js';
import { RefreshToken, User } from '../../generated/prisma/client.js';
import { IAuthRepository, RotateRefreshTokenData } from './auth.interface.js';
import { createRefreshTokenData, CreateUserData } from './auth.types.js';

class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return null;
    return user;
  }
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return null;
    return user;
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async createRefreshToken(data: createRefreshTokenData): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        jti: data.jti,
        familyId: data.familyId,
        expiresAt: data.expiresAt,
        deviceName: data.deviceName ?? null,
        userAgent: data.userAgent ?? null,
        ipAddress: data.ipAddress ?? null,
      },
    });
  }
  async findRefreshTokenByJti(jti: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: {
        jti,
      },
    });
  }

  async revokeRefreshToken(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async rotateRefreshToken(data: RotateRefreshTokenData): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.refreshToken.updateMany({
        where: {
          jti: data.jti,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (result.count !== 1) {
        return false;
      }

      await tx.refreshToken.create({
        data: {
          userId: data.userId,
          tokenHash: data.tokenHash,
          jti: data.jti,
          familyId: data.familyId,
          expiresAt: data.expiresAt,
          deviceName: data.deviceName ?? null,
          userAgent: data.userAgent ?? null,
          ipAddress: data.ipAddress ?? null,
        },
      });

      return true;
    });
  }

  async revokeTokenFamily(familyId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        familyId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
  async findActiveSessions(userId: string): Promise<RefreshToken[]> {
    return prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async revokeSession(sessionId: string, userId: string): Promise<boolean> {
    const result = await prisma.refreshToken.updateMany({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count === 1;
  }
  async deleteExpiredRefreshTokens(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
  async deleteOldRevokedRefreshTokens(retentionDays: number): Promise<number> {
    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - retentionDays);
    const result = await prisma.refreshToken.deleteMany({
      where: {
        revokedAt: {
          not: null,
        },
        expiresAt: {
          lt: cutoff,
        },
      },
    });
    return result.count;
  }
}

export const authRepository = new AuthRepository();

import { authRepository } from './auth.repository.js';

export const cleanupRefreshTokens = async (): Promise<void> => {
  const expiredCount = await authRepository.deleteExpiredRefreshTokens();
  const revokedCount = await authRepository.deleteOldRevokedRefreshTokens(7);
  console.log(`[AUTH CLEANUP] Deleted ${expiredCount} expired refresh tokens.`);

  console.log(`[AUTH CLEANUP] Deleted ${revokedCount} old revoked refresh tokens.`);
};

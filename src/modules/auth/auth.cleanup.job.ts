import { cleanupRefreshTokens } from './auth.cleanup.js';

export const startAuthCleanupJob = (): void => {
  const ONE_HOUR = 60 * 60 * 1000;

  setInterval(async () => {
    try {
      await cleanupRefreshTokens();
    } catch (error) {
      console.error('[AUTH CLEANUP] Failed:', error);
    }
  }, ONE_HOUR);
};

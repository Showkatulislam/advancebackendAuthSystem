import argon2 from 'argon2';

export const hashPassword = (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export const verifyPassword = async (passwordHash: string, password: string): Promise<boolean> => {
  return argon2.verify(passwordHash, password);
};

export const hashRefreshToken = async (refreshToken: string): Promise<string> => {
  return argon2.hash(refreshToken);
};

export const verifyRefreshTokenHash = async (
  token: string,
  tokenHash: string,
): Promise<boolean> => {
  return argon2.verify(tokenHash, token);
};

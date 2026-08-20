import { prisma } from '../../config/database.js';
import { User } from '../../generated/prisma/client.js';
import { IAuthRepository } from './auth.interface.js';
import { AuthUser, CreateUserData, RegisterInput } from './auth.types.js';

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

  async create(data: CreateUserData): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}

export const authRepository = new AuthRepository();

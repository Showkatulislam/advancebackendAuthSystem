import { User } from '../../generated/prisma/client.js';
import { CreateUserData } from './auth.types.js';

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User | null>;
}

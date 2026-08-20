import { hashPassword, verifyPassword } from '../../utils/password.js';
import { AppError } from '../../utils/appError.js';
import { IAuthRepository } from './auth.interface.js';
import { authRepository } from './auth.repository.js';
import { AuthUser, CreateUserData, RegisterInput } from './auth.types.js';

class AuthService {
    constructor(private readonly repo: IAuthRepository) { }
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

    async login(email: string, password: string): Promise<AuthUser> {
        const user = await this.repo.findByEmail(email);

        if (!user) {
            throw new AppError(401, 'Invalid email or password.');
        }

        const isPasswordValid = await verifyPassword(user.password ?? "", password);

        if (!isPasswordValid) {
            throw new AppError(401, "Invalid email or password")
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}

export const authService = new AuthService(authRepository);

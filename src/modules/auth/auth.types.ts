export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

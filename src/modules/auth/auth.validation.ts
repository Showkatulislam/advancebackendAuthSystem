import z from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characteters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address.')
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password muust not exceed 128 characters.'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please Provide a valid email eddress.'),
  password: z.string().min(1, 'Password is required.'),
});

export const accessTokenPayloadSchema = z.object({
  sub: z.string().min(1),
  role:z.enum(["USER","ADMIN"])
})

export type RegisterInput = z.infer<typeof registerSchema>;

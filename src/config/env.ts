import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(12),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(12),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7D'),
});
const parseEnv = envSchema.safeParse(process.env);

if (!parseEnv.success) {
  console.error('Invalid environment configuration .');
  console.error(parseEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parseEnv.data;

import { z } from 'zod';

// Environment validation schema
const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),

  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().min(1).max(65535).default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('smart_therapy_dev'),
  DB_SSL: z.coerce.boolean().default(false),

  // JWT configuration
  JWT_SECRET: z
    .string()
    .min(32)
    .default('your_jwt_secret_here_minimum_32_characters_long'),
  JWT_EXPIRES_IN: z.string().default('24h'),

  // Rate limiting
  THROTTLE_TTL: z.coerce.number().positive().default(60000),
  THROTTLE_LIMIT: z.coerce.number().positive().default(100),
});

export type EnvironmentConfig = z.infer<typeof environmentSchema>;

export function validateEnvironment(): EnvironmentConfig {
  const result = environmentSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Environment validation failed:\n${result.error.issues
        .map((err) => `- ${err.path.join('.')}: ${err.message}`)
        .join('\n')}`,
    );
  }

  return result.data;
}

export const environmentConfig = validateEnvironment();

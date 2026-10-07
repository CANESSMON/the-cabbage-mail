import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/emailbhejo?schema=public'),
  JWT_SECRET: z.string().default('emailbhejo_default_jwt_secret_key_change_in_prod'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Dynamic Email Dispatcher Config ('AWS' | 'MOCK')
  EMAIL_PROVIDER: z.enum(['AWS', 'MOCK']).default('AWS'),
  
  // AWS SES Cloud Credentials
  AWS_REGION: z.string().default('eu-north-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SES_FROM_EMAIL: z.string().default('info@emailbhejo.com'),
  SES_FROM_NAME: z.string().default('EmailBhejo'),
});

export const env = envSchema.parse(process.env);

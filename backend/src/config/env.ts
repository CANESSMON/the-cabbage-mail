import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/emailbhejo?schema=public'),
  JWT_SECRET: z.string().default('emailbhejo_default_jwt_secret_key_change_in_prod'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Dynamic Email Dispatcher Config
  EMAIL_PROVIDER: z.enum(['AWS', 'SMTP', 'MOCK']).default('AWS'),
  
  // AWS Credentials
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SES_FROM_EMAIL: z.string().default('info@emailbhejo.com'),
  SES_FROM_NAME: z.string().default('EmailBhejo'),
  
  // Gmail / Universal SMTP Credentials
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_SECURE: z.string().default('false'),
  SMTP_FROM: z.string().default('EmailBhejo <noreply@emailbhejo.com>'),
  SMTP_TO: z.string().optional()
});

export const env = envSchema.parse(process.env);

import dotenv from 'dotenv';

dotenv.config();

interface Config {
  NODE_ENV: string;
  PORT: number;
  CLIENT_URL: string;
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  STYTCH_PUBLIC_TOKEN: string;
  JWT_SECRET: string;
  WORQHAT_API_KEY: string;
}

const requiredEnvVars = [
  'STYTCH_PROJECT_ID',
  'STYTCH_SECRET',
  'STYTCH_PUBLIC_TOKEN',
  'JWT_SECRET',
  'WORQHAT_API_KEY'
];

const validateConfig = (): Config => {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    STYTCH_PROJECT_ID: process.env.STYTCH_PROJECT_ID!,
    STYTCH_SECRET: process.env.STYTCH_SECRET!,
    STYTCH_PUBLIC_TOKEN: process.env.STYTCH_PUBLIC_TOKEN!,
    JWT_SECRET: process.env.JWT_SECRET!,
    WORQHAT_API_KEY: process.env.WORQHAT_API_KEY!,
  };
};

export const config = validateConfig();
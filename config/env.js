import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });


export const {
  PORT,
  NODE_ENV,
  DB_URI,
  ACCESS_TOKEN_EXPIRE_DATE,
  REFRESH_TOKEN_EXPIRE_DATE,
  ACCESS_TOKEN_PUBLIC_KEY,
  ACCESS_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
} = {
  ...process.env,
  ACCESS_TOKEN_PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY?.replace(/\\n/g, '\n'),
  ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  REFRESH_TOKEN_PUBLIC_KEY: process.env.REFRESH_TOKEN_PUBLIC_KEY?.replace(/\\n/g, '\n'),
  REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
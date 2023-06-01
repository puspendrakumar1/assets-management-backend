export const MSSQL_HOST = process.env.MSSQL_HOST;
export const MSSQL_PORT = +process.env.MSSQL_PORT;
export const MSSQL_USERNAME = process.env.MSSQL_USERNAME;
export const MSSQL_PASSWORD = process.env.MSSQL_PASSWORD;
export const MSSQL_DATABASE = process.env.MSSQL_DATABASE;

export const JWT_SECRET = process.env.JWT_SECRET;

export const MONGODB_URI = process.env.MONGODB_URI;

export const AD_ROOT_USERNAME = process.env.AD_ROOT_USERNAME;
export const AD_ROOT_PASSWORD = process.env.AD_ROOT_PASSWORD;
export const AD_URL = process.env.AD_URL;
export const AD_BASE_DN = process.env.AD_BASE_DN;
export const AD_DOMAIN_NAME = process.env.AD_DOMAIN_NAME;

export const ASTMNGT_ADMIN_USERNAMES = process.env.ASTMNGT_ADMIN_USERNAMES
  ? `${process.env.ASTMNGT_ADMIN_USERNAMES}`
      .split(',')
      .map((username) => username.trim().toLowerCase())
  : [];

export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

export const DEFAULT_USER_EMAIL = process.env.DEFAULT_USER_EMAIL;
export const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD;

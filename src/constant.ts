import dotenv from 'dotenv';
import pino from 'pino';
import {DBUtils} from './db/dbService';

dotenv.config();

export const LOGGER = pino({level: process.env.LOG_LEVEL || 'debug'});
export const NODE_ENV = process.env.NODE_ENV || 'dev';

export const pgOpts = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'tf_admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_DATABASE || 'tf',
};

export const db = new DBUtils();

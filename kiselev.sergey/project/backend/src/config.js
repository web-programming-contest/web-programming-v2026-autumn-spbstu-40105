import path from 'node:path';
import process from 'node:process';

export const PORT = Number(process.env.PORT ?? 8080);

export const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';

export const DATA_DIR = path.join(import.meta.dirname, '..', 'data');

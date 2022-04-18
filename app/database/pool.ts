import { createPool } from 'slonik';
import { APP_CONFIG } from '../config';

export const pool = createPool(APP_CONFIG.DATABASE_URL || '');

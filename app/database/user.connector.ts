import { User } from '~/domain.model';
import { pool } from '~/database/pool';
import { DatabasePool } from 'slonik/dist/src/types';
import { sql } from 'slonik';

export type UserConnector = {};

type UserDataModel = {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string | null;
};

/**
 * Parse User in form of data model to domain model.
 */
const parseJoke = (data: UserDataModel): User => ({
  id: data.id,
  username: data.username,
  passwordHash: data.password_hash,
  createdAt: new Date(data.created_at),
  updatedAt: data.updated_at ? new Date(data.updated_at) : null,
});

export const createUserConnector = (db: DatabasePool = pool): UserConnector => {
  return {};
};

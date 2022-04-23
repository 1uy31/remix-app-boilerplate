import { User } from '~/domain.model';
import { pool } from '~/database/pool';
import { DatabasePool } from 'slonik/dist/src/types';
import { sql } from 'slonik';
import bcrypt from 'bcryptjs';

export type UserConnector = {
  getByUsername: (username: string) => Promise<User | undefined>;
  create: (username: string, password: string) => Promise<User>;
};

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
const parseUser = (data: UserDataModel): User => ({
  id: data.id,
  username: data.username,
  passwordHash: data.password_hash,
  createdAt: new Date(data.created_at),
  updatedAt: data.updated_at ? new Date(data.updated_at) : null,
});

export const createUserConnector = (db: DatabasePool = pool): UserConnector => {
  const getByUsername = async (username: string) => {
    const raw = await db.query(sql<UserDataModel>`SELECT * FROM user_table WHERE username = ${username} LIMIT 1;`);

    if (raw.rows.length !== 1) {
      return undefined;
    }
    return parseUser(raw.rows[0]);
  };

  const create = async (username: string, password: string) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const raw = await db.query(
      sql<UserDataModel>`INSERT INTO user_table (username, password_hash) VALUES (${username}, ${passwordHash}) RETURNING *;`,
    );
    return parseUser(raw.rows[0]);
  };

  return {
    getByUsername,
    create,
  };
};

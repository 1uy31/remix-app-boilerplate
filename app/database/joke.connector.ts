import { Joke } from '~/domain.model';
import { pool } from '~/database/pool';
import { DatabasePool } from 'slonik/dist/src/types';
import { sql } from 'slonik';

export type JokeConnector = {
  getCount: () => Promise<number>;
  getList: (limit?: number, offset?: number) => Promise<Array<Joke>>;
  getById: (id: string) => Promise<Joke | undefined>;
  create: (name: string, content: string) => Promise<Joke>;
};

type JokeDataModel = {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string | null;
};

/**
 * Parse Joke in form of data model to domain model.
 */
const parseJoke = (data: JokeDataModel): Joke => ({
  id: data.id,
  name: data.name,
  content: data.content,
  createdAt: new Date(data.created_at),
  updatedAt: data.updated_at ? new Date(data.updated_at) : null,
});

export const createJokeConnector = (db: DatabasePool = pool): JokeConnector => {
  const getCount = async () => {
    const raw = await db.query(sql<{ count: number }>`SELECT COUNT(*) FROM joke;`);

    if (raw.rows.length < 1) {
      return 0;
    }
    return raw.rows[0].count;
  };

  const getList = async (limit: number = 10, offset: number = 0) => {
    const raw = await db.query(
      sql<JokeDataModel>`SELECT * FROM joke ORDER BY created_at LIMIT ${limit} OFFSET ${offset};`,
    );

    if (raw.rows.length < 1) {
      return [];
    }
    return raw.rows.map((row) => parseJoke(row));
  };

  const getById = async (id: string) => {
    const raw = await db.query(sql<JokeDataModel>`SELECT * FROM joke WHERE id = ${id} LIMIT 1;`);

    if (raw.rows.length !== 1) {
      return undefined;
    }
    return parseJoke(raw.rows[0]);
  };

  const create = async (name: string, content: string) => {
    const raw = await db.query(
      sql<JokeDataModel>`INSERT INTO joke (name, content) VALUES (${name}, ${content}) RETURNING *;`,
    );
    return parseJoke(raw.rows[0]);
  };

  return {
    getCount,
    getList,
    getById,
    create,
  };
};

import { Joke } from '~/domain.model';
import { pool } from '~/database/pool';
import { DatabasePool } from 'slonik/dist/src/types';
import { sql } from 'slonik';

type JokeConnector = {
  getCount: () => Promise<number>;
  getList: (limit?: number, offset?: number) => Promise<Array<Joke>>;
};

type JokeDataModel = {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string | null;
};

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
    return raw.rows.map((row) => ({
      id: row.id,
      name: row.name,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
    }));
  };

  return {
    getCount,
    getList,
  };
};

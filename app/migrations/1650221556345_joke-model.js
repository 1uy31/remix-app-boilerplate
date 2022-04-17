/* eslint-disable camelcase */

const { PgLiteral } = require('node-pg-migrate');
exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.createTable('joke', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: new PgLiteral('uuid_generate_v4()'),
    },
    name: { type: 'varchar(1000)', notNull: true },
    content: { type: 'varchar(1000)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });
};

exports.down = (pgm) => {};

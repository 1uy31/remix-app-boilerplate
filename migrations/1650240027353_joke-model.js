/* eslint-disable camelcase */

const { PgLiteral } = require('node-pg-migrate');
exports.shorthands = undefined;

/**
 * Data model for "joke".
 */
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
      type: 'timestamptz',
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: false,
      default: null,
    },
  });
  await pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON joke
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();`);
};

/**
 * Ignore on purpose.
 */
exports.down = (pgm) => {};

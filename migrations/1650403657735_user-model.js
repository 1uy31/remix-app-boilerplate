/* eslint-disable camelcase */

const { PgLiteral } = require('node-pg-migrate');
exports.shorthands = undefined;

/**
 * Data model for "user".
 */
exports.up = async (pgm) => {
  await pgm.createTable('user', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: new PgLiteral('uuid_generate_v4()'),
    },
    username: { type: 'varchar(512)', notNull: true },
    password_hash: { type: 'varchar', notNull: true },
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
    CREATE TRIGGER trg_user_updated_at
    BEFORE UPDATE ON user
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();`);
};

/**
 * Ignore on purpose.
 */
exports.down = (pgm) => {};

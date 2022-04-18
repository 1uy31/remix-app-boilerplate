/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * - Add extension uuid-ossp
 * - Create trigger_set_timestamp for field updated_at
 */
exports.up = async (pgm) => {
  await pgm.createExtension('uuid-ossp', { ifNotExists: true });
  await pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp() 
    RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = (now() at time zone 'utc');
        RETURN NEW;
      END;
    $$ LANGUAGE plpgsql;`);
};

/**
 * Ignore on purpose.
 */
exports.down = (pgm) => {};

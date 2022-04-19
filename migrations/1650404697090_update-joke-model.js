/* eslint-disable camelcase */

const { PgLiteral } = require('node-pg-migrate');
exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.sql(`
    ALTER TABLE joke
    ADD COLUMN user_id uuid
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES user_table(id)`);
};

/**
 * Ignore on purpose.
 */
exports.down = (pgm) => {};

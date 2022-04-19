/* eslint-disable camelcase */

const { PgLiteral } = require('node-pg-migrate');
exports.shorthands = undefined;

/**
 * Rename trigger set_updated_at of table "joke" so that naming folows consistent convention.
 */
exports.up = async (pgm) => {
  await pgm.sql(`
    ALTER TRIGGER set_updated_at
    ON joke 
    RENAME TO trg_joke_updated_at;`);
};

/**
 * Ignore on purpose.
 */
exports.down = (pgm) => {};



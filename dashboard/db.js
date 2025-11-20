/**
 * Dynamic Database Driver Loader
 *
 * This module reads the application configuration and loads the appropriate
 * database driver (e.g., JSON, SQLite) based on the `database.type` setting.
 * It provides a single point of access for all data operations, abstracting
 * away the underlying storage mechanism.
 */

const config = require('./config');

let dbDriver;

const dbType = config.database.type;

console.log(`[DB] Initializing database driver of type: ${dbType.toUpperCase()}`);

switch (dbType) {
  case 'sqlite':
    dbDriver = require('./lib/db_sqlite');
    break;
  case 'json':
    dbDriver = require('./lib/db_json');
    break;
  // In futuro si potranno aggiungere altri driver
  // case 'postgres':
  //   dbDriver = require('./lib/db_postgres');
  //   break;
  default:
    throw new Error(`Unsupported database type: ${dbType}`);
}

module.exports = dbDriver;

#!/usr/bin/env node
/**
 * Database Initialization Script
 * Runs all SQL schema files in order to set up TimescaleDB
 */

const fs = require('fs');
const path = require('path');
const TimescaleClient = require('../timescale-client');

async function main() {
  console.log('Initializing CPF Detection Engine database...\n');

  const db = new TimescaleClient();

  // Check connection
  console.log('Checking database connection...');
  const health = await db.healthCheck();

  if (!health.healthy) {
    console.error('❌ Database connection failed:', health.error);
    console.error('\nMake sure TimescaleDB is running:');
    console.error('  docker-compose up -d\n');
    process.exit(1);
  }

  console.log('✓ Connected to database');
  console.log(`  PostgreSQL version: ${health.version}\n`);

  // Find all .sql files in schema directory
  const schemaDir = path.join(__dirname, '../schema');
  const schemaFiles = fs.readdirSync(schemaDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${schemaFiles.length} schema files:\n`);

  // Execute each schema file
  for (const file of schemaFiles) {
    const filePath = path.join(schemaDir, file);
    console.log(`Executing ${file}...`);

    try {
      const sql = fs.readFileSync(filePath, 'utf8');

      // Split on semicolons but preserve them in CREATE FUNCTION blocks
      const statements = sql
        .split(/;\s*(?=(?:[^']*'[^']*')*[^']*$)/)  // Split on ; not in strings
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.length > 0) {
          await db.query(statement);
        }
      }

      console.log(`✓ ${file} executed successfully\n`);

    } catch (err) {
      console.error(`❌ Error executing ${file}:`);
      console.error(err.message);
      console.error('\nRolling back...\n');

      await db.close();
      process.exit(1);
    }
  }

  // Verify tables created
  console.log('Verifying tables...');

  const tablesResult = await db.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);

  const tables = tablesResult.rows.map(r => r.tablename);

  console.log(`✓ Created ${tables.length} tables:`);
  tables.forEach(t => console.log(`  - ${t}`));

  // Verify hypertables
  console.log('\nVerifying hypertables...');

  const hyperTablesResult = await db.query(`
    SELECT hypertable_name
    FROM timescaledb_information.hypertables
    ORDER BY hypertable_name
  `);

  const hypertables = hyperTablesResult.rows.map(r => r.hypertable_name);

  console.log(`✓ Created ${hypertables.length} hypertables (TimescaleDB):`);
  hypertables.forEach(t => console.log(`  - ${t}`));

  console.log('\n✅ Database initialization complete!\n');

  await db.close();
}

main().catch(err => {
  console.error('❌ Initialization failed:');
  console.error(err);
  process.exit(1);
});

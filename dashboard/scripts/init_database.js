#!/usr/bin/env node

/**
 * CPF Dashboard - Database Initialization Script
 *
 * Questo script ELIMINA completamente il database esistente e lo ricrea da zero.
 * Include 3 richieste di conferma per prevenire eliminazioni accidentali.
 *
 * Supporta: JSON, SQLite, PostgreSQL
 *
 * Usage:
 *   DATABASE_TYPE=sqlite node dashboard/scripts/init_database.js
 *   DATABASE_TYPE=postgres node dashboard/scripts/init_database.js
 *   DATABASE_TYPE=json node dashboard/scripts/init_database.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const { Pool } = require('pg');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

// Percorsi
const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');
const SQLITE_DB_PATH = config.database.sqlite.path;
const SCHEMA_DIR = path.join(__dirname, '..', 'lib', 'schemas');

// Colori per output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Helper per input da console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================================================
// CONFERME DI SICUREZZA
// ============================================================================

async function requestConfirmations() {
  log('\n' + '='.repeat(70), 'red');
  log('⚠️  ATTENZIONE: INIZIALIZZAZIONE DATABASE', 'red');
  log('='.repeat(70), 'red');
  log('\nQuesta operazione:', 'yellow');
  log('  • ELIMINERÀ TUTTI I DATI ESISTENTI nel database', 'yellow');
  log('  • RICREERÀ le tabelle da zero', 'yellow');
  log('  • GENERERÀ dati demo (5 organizzazioni)', 'yellow');
  log(`\nTipo di database: ${config.database.type.toUpperCase()}`, 'cyan');

  if (config.database.type === 'postgres') {
    log(`URL: ${config.database.postgres.connectionString ? config.database.postgres.connectionString.replace(/:[^:@]+@/, ':***@') : 'NON CONFIGURATO'}`, 'cyan');
  } else if (config.database.type === 'sqlite') {
    log(`File: ${SQLITE_DB_PATH}`, 'cyan');
  } else if (config.database.type === 'json') {
    log(`Directory: ${ORGS_DIR}`, 'cyan');
  }

  // CONFERMA 1
  log('\n🔴 CONFERMA 1/3', 'red');
  const confirm1 = await question('Stai per ELIMINARE TUTTI I DATI del database. Sei sicuro? (scrivi "yes" per continuare): ');
  if (confirm1.toLowerCase() !== 'yes') {
    log('\n❌ Operazione annullata.', 'yellow');
    return false;
  }

  // CONFERMA 2
  log('\n🟠 CONFERMA 2/3', 'yellow');
  const confirm2 = await question('Questo cancellerà PERMANENTEMENTE tutti i dati esistenti. Confermi? (scrivi "yes" per continuare): ');
  if (confirm2.toLowerCase() !== 'yes') {
    log('\n❌ Operazione annullata.', 'yellow');
    return false;
  }

  // CONFERMA 3
  log('\n🟡 CONFERMA 3/3 - ULTIMA CONFERMA', 'yellow');
  const confirm3 = await question('ULTIMA CONFERMA: procedere con l\'eliminazione e ricostruzione del database? (scrivi "yes" per continuare): ');
  if (confirm3.toLowerCase() !== 'yes') {
    log('\n❌ Operazione annullata.', 'yellow');
    return false;
  }

  log('\n✅ Tutte le conferme ricevute. Procedendo con l\'inizializzazione...', 'green');
  return true;
}

// ============================================================================
// INIZIALIZZAZIONE JSON
// ============================================================================

async function initializeJSON() {
  log('\n📁 Inizializzazione database JSON...', 'cyan');

  // 1. Elimina directory organizations se esiste
  if (fs.existsSync(ORGS_DIR)) {
    const files = fs.readdirSync(ORGS_DIR);
    files.forEach(file => {
      fs.unlinkSync(path.join(ORGS_DIR, file));
    });
    log(`  ✓ Eliminati ${files.length} file JSON esistenti`, 'green');
  } else {
    // Crea directory se non esiste
    fs.mkdirSync(ORGS_DIR, { recursive: true });
    log('  ✓ Creata directory organizations', 'green');
  }

  // 2. Elimina file indice se esiste
  if (fs.existsSync(INDEX_FILE)) {
    fs.unlinkSync(INDEX_FILE);
    log('  ✓ Eliminato file indice esistente', 'green');
  }

  // 3. Crea directory data se non esiste
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    log('  ✓ Creata directory data', 'green');
  }

  log('✅ Database JSON inizializzato con successo', 'green');
}

// ============================================================================
// INIZIALIZZAZIONE SQLITE
// ============================================================================

async function initializeSQLite() {
  log('\n💾 Inizializzazione database SQLite...', 'cyan');

  // 1. Elimina file database esistente
  if (fs.existsSync(SQLITE_DB_PATH)) {
    fs.unlinkSync(SQLITE_DB_PATH);
    log('  ✓ Eliminato file database SQLite esistente', 'green');
  }

  // 2. Crea directory data se non esiste
  const dataDir = path.dirname(SQLITE_DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    log('  ✓ Creata directory data', 'green');
  }

  // 3. Leggi schema SQLite
  const schemaPath = path.join(SCHEMA_DIR, 'db_schema_sqlite.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file non trovato: ${schemaPath}`);
  }
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // 4. Crea database e applica schema
  const db = await sqlite.open({
    filename: SQLITE_DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(schema);
  log('  ✓ Schema SQLite applicato', 'green');

  // 5. Verifica tabelle create
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  log(`  ✓ Tabelle create: ${tables.map(t => t.name).join(', ')}`, 'green');

  await db.close();
  log('✅ Database SQLite inizializzato con successo', 'green');
}

// ============================================================================
// INIZIALIZZAZIONE POSTGRESQL
// ============================================================================

async function initializePostgreSQL() {
  log('\n🐘 Inizializzazione database PostgreSQL...', 'cyan');

  // Verifica configurazione
  if (!config.database.postgres.connectionString) {
    throw new Error('DATABASE_URL non configurato! Imposta la variabile d\'ambiente DATABASE_URL.');
  }

  const pool = new Pool({
    connectionString: config.database.postgres.connectionString
  });

  try {
    // Test connessione
    await pool.query('SELECT NOW()');
    log('  ✓ Connessione a PostgreSQL stabilita', 'green');

    // Leggi schema PostgreSQL
    const schemaPath = path.join(SCHEMA_DIR, 'db_schema_postgres.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file non trovato: ${schemaPath}`);
    }
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Esegui schema (include DROP TABLE CASCADE)
    await pool.query(schema);
    log('  ✓ Schema PostgreSQL applicato (tabelle droppate e ricreate)', 'green');

    // Verifica tabelle create
    const result = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    const tables = result.rows.map(r => r.tablename);
    log(`  ✓ Tabelle create: ${tables.join(', ')}`, 'green');

  } finally {
    await pool.end();
  }

  log('✅ Database PostgreSQL inizializzato con successo', 'green');
}

// ============================================================================
// GENERAZIONE DATI DEMO
// ============================================================================

async function generateDemoData() {
  log('\n🎲 Generazione dati demo...', 'cyan');

  // Import dinamico del modulo
  const { generateDemoOrganizations } = require('./generate_demo_organizations');
  const db = require('../db');

  // Genera organizzazioni demo
  const demoOrgs = await generateDemoOrganizations();
  log(`  ✓ Generate ${demoOrgs.length} organizzazioni demo`, 'green');

  // Salva nel database usando il driver appropriato
  let successCount = 0;
  for (const org of demoOrgs) {
    try {
      await db.createOrganization(org);
      const assessmentCount = Object.keys(org.assessments).length;
      log(`  ✓ ${org.name}: ${assessmentCount} assessments`, 'green');
      successCount++;
    } catch (error) {
      log(`  ✗ Errore salvando ${org.name}: ${error.message}`, 'red');
    }
  }

  if (successCount === demoOrgs.length) {
    log(`✅ Tutti i dati demo sono stati creati con successo (${successCount}/${demoOrgs.length})`, 'green');
  } else {
    log(`⚠️  Alcuni dati demo non sono stati creati (${successCount}/${demoOrgs.length})`, 'yellow');
  }

  return { total: demoOrgs.length, success: successCount };
}

// ============================================================================
// VERIFICA FINALE
// ============================================================================

async function verifyDatabase() {
  log('\n🔍 Verifica database...', 'cyan');

  const db = require('../db');

  try {
    // Leggi indice organizzazioni
    const index = await db.readOrganizationsIndex();
    const orgCount = index.organizations.length;

    if (orgCount === 0) {
      log('  ⚠️  Nessuna organizzazione trovata nel database', 'yellow');
      return false;
    }

    log(`  ✓ Organizzazioni nel database: ${orgCount}`, 'green');

    // Verifica prima organizzazione
    if (orgCount > 0) {
      const firstOrg = index.organizations[0];
      const orgData = await db.readOrganization(firstOrg.id);

      if (!orgData) {
        log('  ✗ Impossibile leggere i dati della prima organizzazione', 'red');
        return false;
      }

      const assessmentCount = Object.keys(orgData.assessments).length;
      log(`  ✓ Prima organizzazione: ${orgData.name} (${assessmentCount} assessments)`, 'green');
    }

    log('✅ Verifica completata con successo', 'green');
    return true;

  } catch (error) {
    log(`  ✗ Errore durante la verifica: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  try {
    log('\n' + '='.repeat(70), 'bold');
    log('🚀 CPF DASHBOARD - INIZIALIZZAZIONE DATABASE', 'bold');
    log('='.repeat(70), 'bold');

    // Richiedi conferme
    const confirmed = await requestConfirmations();
    if (!confirmed) {
      rl.close();
      process.exit(0);
    }

    log('\n' + '='.repeat(70), 'cyan');
    log('INIZIO INIZIALIZZAZIONE', 'cyan');
    log('='.repeat(70), 'cyan');

    // Inizializza database in base al tipo
    switch (config.database.type.toLowerCase()) {
      case 'json':
        await initializeJSON();
        break;
      case 'sqlite':
        await initializeSQLite();
        break;
      case 'postgres':
        await initializePostgreSQL();
        break;
      default:
        throw new Error(`Tipo di database non supportato: ${config.database.type}`);
    }

    // Genera dati demo
    const stats = await generateDemoData();

    // Verifica finale
    await verifyDatabase();

    // Report finale
    log('\n' + '='.repeat(70), 'green');
    log('✅ INIZIALIZZAZIONE COMPLETATA CON SUCCESSO', 'green');
    log('='.repeat(70), 'green');
    log('\n📊 Riepilogo:', 'cyan');
    log(`  • Tipo database: ${config.database.type.toUpperCase()}`, 'cyan');
    log(`  • Organizzazioni create: ${stats.success}/${stats.total}`, 'cyan');
    log(`  • Assessments totali: ~${stats.success * 45} (circa 45 per organizzazione)`, 'cyan');

    log('\n🚀 Prossimi passi:', 'cyan');
    log('  1. Avvia il server: npm start', 'cyan');
    log('  2. Apri il browser: http://localhost:3000/dashboard/auditing/', 'cyan');
    log('  3. Esplora i dati demo creati', 'cyan');
    log('');

  } catch (error) {
    log('\n' + '='.repeat(70), 'red');
    log('❌ ERRORE DURANTE L\'INIZIALIZZAZIONE', 'red');
    log('='.repeat(70), 'red');
    log(`\nErrore: ${error.message}`, 'red');
    if (error.stack) {
      log(`\nStack trace:\n${error.stack}`, 'red');
    }
    log('');
    rl.close();
    process.exit(1);
  }

  rl.close();
  process.exit(0);
}

// Esegui script
main();

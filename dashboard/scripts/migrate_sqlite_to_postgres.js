#!/usr/bin/env node

/**
 * Migration Script: SQLite → PostgreSQL
 *
 * Migra tutti i dati da database SQLite a PostgreSQL.
 *
 * Usage:
 *   node dashboard/scripts/migrate_sqlite_to_postgres.js
 *
 * Pre-requisiti:
 *   - Database SQLite esistente in dashboard/data/cpf_dashboard.sqlite
 *   - PostgreSQL installato e database creato
 *   - DATABASE_URL configurato in .env
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     💾 → 🐘  Migrazione SQLite → PostgreSQL                ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Load environment for DATABASE_URL
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Step 1: Verifica pre-requisiti
console.log('[1/6] Verifica pre-requisiti...');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SQLITE_PATH = path.join(DATA_DIR, 'cpf_dashboard.sqlite');

if (!fs.existsSync(SQLITE_PATH)) {
  console.error('❌ Database SQLite non trovato!');
  console.error(`   Percorso: ${SQLITE_PATH}`);
  console.error('\n💡 Assicurati di avere un database SQLite prima di migrare.');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL non configurato!');
  console.error('\n💡 Aggiungi DATABASE_URL al file .env:');
  console.error('   DATABASE_URL="postgresql://user:password@localhost:5432/cpf_dashboard"');
  process.exit(1);
}

console.log(`✅ Database SQLite: ${SQLITE_PATH}`);
console.log(`✅ PostgreSQL URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')}\n`);

// Step 2: Setup adapters
console.log('[2/6] Inizializzazione adapters...');

const dbSqlite = require('../lib/db_sqlite');
const dbPostgres = require('../lib/db_postgres');

(async () => {
  try {
    // Step 3: Conta organizzazioni in SQLite
    console.log('[3/6] Lettura organizzazioni da SQLite...');

    const sqliteOrgs = await dbSqlite.readOrganizationsIndex();
    const orgCount = sqliteOrgs.organizations?.length || 0;

    if (orgCount === 0) {
      console.error('❌ Nessuna organizzazione trovata in SQLite!');
      process.exit(1);
    }

    console.log(`✅ Trovate ${orgCount} organizzazioni da migrare\n`);

    // Step 4: Inizializza PostgreSQL (crea tabelle se non esistono)
    console.log('[4/6] Inizializzazione database PostgreSQL...');
    await dbPostgres.initialize();
    console.log('✅ Database PostgreSQL pronto\n');

    // Step 5: Migrazione dati
    console.log('[5/6] Migrazione organizzazioni e assessments...');

    let migratedOrgs = 0;
    let migratedAssessments = 0;
    let errors = 0;

    for (const orgEntry of sqliteOrgs.organizations) {
      try {
        const orgId = orgEntry.id;

        // Leggi dati completi da SQLite
        const orgData = await dbSqlite.readOrganization(orgId);

        if (!orgData) {
          console.warn(`   ⚠️  Organizzazione ${orgId} non trovata (skip)`);
          continue;
        }

        // Crea organizzazione in PostgreSQL
        await dbPostgres.createOrganization(orgData);
        migratedOrgs++;

        // Conta assessments
        const assessmentCount = Object.keys(orgData.assessments || {}).length;
        migratedAssessments += assessmentCount;

        console.log(`   ✅ ${orgId} (${assessmentCount} assessments)`);

      } catch (error) {
        errors++;
        console.error(`   ❌ Errore migrando ${orgEntry.id}: ${error.message}`);
      }
    }

    // Step 6: Riepilogo
    console.log('\n[6/6] Riepilogo migrazione\n');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   Organizzazioni migrate:  ${migratedOrgs}/${orgCount}`);
    console.log(`   Assessments migrati:     ${migratedAssessments}`);
    console.log(`   Errori:                  ${errors}`);
    console.log('───────────────────────────────────────────────────────────\n');

    if (errors === 0 && migratedOrgs === orgCount) {
      console.log('✅ Migrazione completata con successo!\n');
      console.log('📝 Prossimi passi:');
      console.log('   1. Aggiorna .env:');
      console.log('      DATABASE_TYPE=postgres');
      console.log('   2. Riavvia server:');
      console.log('      npm start');
      console.log('   3. Verifica dati:');
      console.log(`      psql ${process.env.DATABASE_URL} -c "SELECT count(*) FROM organizations;"\n`);
    } else {
      console.log('⚠️  Migrazione completata con alcuni errori.');
      console.log(`   Verificare i ${errors} errori sopra.\n`);
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Errore critico durante migrazione:');
    console.error(error);
    process.exit(1);
  }
})();

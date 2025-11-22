#!/usr/bin/env node

/**
 * Migration Script: JSON → SQLite
 *
 * Migra tutti i dati da file JSON a database SQLite.
 *
 * Usage:
 *   node dashboard/scripts/migrate_json_to_sqlite.js
 *
 * Pre-requisiti:
 *   - Dati JSON esistenti in dashboard/data/organizations/
 *   - DATABASE_TYPE=json in .env (o non impostato, default)
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     📦 → 💾  Migrazione JSON → SQLite                      ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Step 1: Verifica JSON source
const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');

console.log('[1/5] Verifica dati JSON sorgente...');

if (!fs.existsSync(INDEX_FILE)) {
  console.error('❌ File organizations_index.json non trovato!');
  console.error(`   Percorso: ${INDEX_FILE}`);
  console.error('\n💡 Assicurati di avere dati JSON prima di migrare.');
  process.exit(1);
}

const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
const orgCount = indexData.organizations?.length || 0;

if (orgCount === 0) {
  console.error('❌ Nessuna organizzazione trovata in organizations_index.json!');
  console.error('\n💡 Genera dati prima con:');
  console.error('   node dashboard/scripts/generate_demo_organizations.js');
  process.exit(1);
}

console.log(`✅ Trovate ${orgCount} organizzazioni da migrare\n`);

// Step 2: Setup SQLite adapter
console.log('[2/5] Inizializzazione database SQLite...');

const dbSqlite = require('../lib/db_sqlite');

(async () => {
  try {
    // Step 3: Verifica database SQLite
    console.log('[3/5] Verifica database SQLite esistente...');

    const sqlitePath = path.join(DATA_DIR, 'cpf_dashboard.sqlite');
    const dbExists = fs.existsSync(sqlitePath);

    if (dbExists) {
      console.log('⚠️  Database SQLite già esistente!');
      console.log(`   Percorso: ${sqlitePath}`);
      console.log('\n   Creazione backup...');

      const backupPath = `${sqlitePath}.backup-${Date.now()}`;
      fs.copyFileSync(sqlitePath, backupPath);
      console.log(`   ✅ Backup salvato: ${backupPath}`);

      // Rimuovi DB esistente
      fs.unlinkSync(sqlitePath);
      console.log('   🗑️  Database esistente rimosso\n');
    } else {
      console.log('✅ Nessun database SQLite esistente (nuovo database)\n');
    }

    // Step 4: Migrazione dati
    console.log('[4/5] Migrazione organizzazioni e assessments...');

    let migratedOrgs = 0;
    let migratedAssessments = 0;
    let errors = 0;

    for (const orgEntry of indexData.organizations) {
      try {
        const orgId = orgEntry.id;
        const orgFile = path.join(ORGS_DIR, `${orgId}.json`);

        if (!fs.existsSync(orgFile)) {
          console.warn(`   ⚠️  File non trovato: ${orgId}.json (skip)`);
          continue;
        }

        // Leggi dati completi organizzazione
        const orgData = JSON.parse(fs.readFileSync(orgFile, 'utf8'));

        // Crea organizzazione in SQLite
        await dbSqlite.createOrganization(orgData);
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

    // Step 5: Riepilogo
    console.log('\n[5/5] Riepilogo migrazione\n');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   Organizzazioni migrate:  ${migratedOrgs}/${orgCount}`);
    console.log(`   Assessments migrati:     ${migratedAssessments}`);
    console.log(`   Errori:                  ${errors}`);
    console.log('───────────────────────────────────────────────────────────\n');

    if (errors === 0 && migratedOrgs === orgCount) {
      console.log('✅ Migrazione completata con successo!\n');
      console.log('📝 Prossimi passi:');
      console.log('   1. Aggiorna .env:');
      console.log('      DATABASE_TYPE=sqlite');
      console.log('   2. Riavvia server:');
      console.log('      npm start');
      console.log('   3. Verifica dati:');
      console.log('      sqlite3 dashboard/data/cpf_dashboard.sqlite "SELECT count(*) FROM organizations;"\n');
    } else {
      console.log('⚠️  Migrazione completata con alcuni errori.');
      console.log(`   Verificare i ${errors} errori sopra.\n`);
    }

  } catch (error) {
    console.error('\n❌ Errore critico durante migrazione:');
    console.error(error);
    process.exit(1);
  }
})();

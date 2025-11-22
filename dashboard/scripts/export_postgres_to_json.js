#!/usr/bin/env node

/**
 * Export Script: PostgreSQL → JSON
 *
 * Esporta tutti i dati da PostgreSQL a file JSON.
 *
 * Usage:
 *   node dashboard/scripts/export_postgres_to_json.js
 *
 * Pre-requisiti:
 *   - PostgreSQL database con dati
 *   - DATABASE_URL configurato in .env
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     🐘 → 📦  Export PostgreSQL → JSON                     ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Load environment for DATABASE_URL
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Step 1: Verifica pre-requisiti
console.log('[1/6] Verifica pre-requisiti...');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL non configurato!');
  console.error('\n💡 Aggiungi DATABASE_URL al file .env:');
  console.error('   DATABASE_URL="postgresql://user:password@localhost:5432/cpf_dashboard"');
  process.exit(1);
}

console.log(`✅ PostgreSQL URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')}\n`);

// Step 2: Setup directories
const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');

console.log('[2/6] Preparazione directory JSON...');

// Backup existing JSON data if present
if (fs.existsSync(ORGS_DIR)) {
  const backupDir = `${ORGS_DIR}.backup-${Date.now()}`;
  console.log('⚠️  Directory organizations/ esistente!');
  console.log(`   Creazione backup: ${backupDir}`);
  fs.renameSync(ORGS_DIR, backupDir);
}

// Create fresh directories
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ORGS_DIR)) {
  fs.mkdirSync(ORGS_DIR, { recursive: true });
}

console.log('✅ Directory preparate\n');

// Step 3: Setup adapter
console.log('[3/6] Connessione a PostgreSQL...');

const dbPostgres = require('../lib/db_postgres');

(async () => {
  try {
    // Initialize PostgreSQL connection
    await dbPostgres.initialize();
    console.log('✅ Connesso a PostgreSQL\n');

    // Step 4: Lettura organizzazioni
    console.log('[4/6] Lettura organizzazioni da PostgreSQL...');

    const pgIndex = await dbPostgres.readOrganizationsIndex();
    const orgCount = pgIndex.organizations?.length || 0;

    if (orgCount === 0) {
      console.error('❌ Nessuna organizzazione trovata in PostgreSQL!');
      process.exit(1);
    }

    console.log(`✅ Trovate ${orgCount} organizzazioni da esportare\n`);

    // Step 5: Export dati
    console.log('[5/6] Export organizzazioni e assessments...');

    let exportedOrgs = 0;
    let exportedAssessments = 0;
    let errors = 0;

    const organizationsForIndex = [];

    for (const orgEntry of pgIndex.organizations) {
      try {
        const orgId = orgEntry.id;

        // Leggi dati completi da PostgreSQL
        const orgData = await dbPostgres.readOrganization(orgId);

        if (!orgData) {
          console.warn(`   ⚠️  Organizzazione ${orgId} non trovata (skip)`);
          continue;
        }

        // Scrivi file JSON organizzazione
        const orgFile = path.join(ORGS_DIR, `${orgId}.json`);
        fs.writeFileSync(orgFile, JSON.stringify(orgData, null, 2), 'utf8');
        exportedOrgs++;

        // Conta assessments
        const assessmentCount = Object.keys(orgData.assessments || {}).length;
        exportedAssessments += assessmentCount;

        // Prepara entry per index
        organizationsForIndex.push({
          id: orgData.id,
          name: orgData.name,
          industry: orgData.metadata.industry,
          size: orgData.metadata.size,
          country: orgData.metadata.country,
          language: orgData.metadata.language,
          sede_sociale: orgData.metadata.sede_sociale || '',
          partita_iva: orgData.metadata.partita_iva || '',
          created_at: orgData.metadata.created_at,
          updated_at: orgData.metadata.updated_at,
          deleted_at: orgData.metadata.deleted_at || null,
          stats: orgData.aggregates ? {
            total_assessments: orgData.aggregates.completion?.assessed_indicators || 0,
            completion_percentage: orgData.aggregates.completion?.percentage || 0,
            overall_risk: orgData.aggregates.overall_risk || 0.5,
            avg_confidence: orgData.aggregates.overall_confidence || 0.0,
            last_assessment_date: getLastAssessmentDate(orgData.assessments)
          } : {
            total_assessments: 0,
            completion_percentage: 0,
            overall_risk: 0.5,
            avg_confidence: 0.0,
            last_assessment_date: null
          }
        });

        console.log(`   ✅ ${orgId} (${assessmentCount} assessments)`);

      } catch (error) {
        errors++;
        console.error(`   ❌ Errore esportando ${orgEntry.id}: ${error.message}`);
      }
    }

    // Scrivi organizations_index.json
    const indexData = {
      metadata: {
        version: '3.0',
        last_updated: new Date().toISOString(),
        total_organizations: organizationsForIndex.length
      },
      organizations: organizationsForIndex
    };

    fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2), 'utf8');

    // Step 6: Riepilogo
    console.log('\n[6/6] Riepilogo export\n');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   Organizzazioni esportate:  ${exportedOrgs}/${orgCount}`);
    console.log(`   Assessments esportati:     ${exportedAssessments}`);
    console.log(`   Errori:                    ${errors}`);
    console.log('───────────────────────────────────────────────────────────\n');

    if (errors === 0 && exportedOrgs === orgCount) {
      console.log('✅ Export completato con successo!\n');
      console.log('📝 Prossimi passi:');
      console.log('   1. Aggiorna .env:');
      console.log('      DATABASE_TYPE=json');
      console.log('   2. Riavvia server:');
      console.log('      npm start');
      console.log('   3. Verifica file:');
      console.log(`      ls -la ${ORGS_DIR}\n`);
    } else {
      console.log('⚠️  Export completato con alcuni errori.');
      console.log(`   Verificare i ${errors} errori sopra.\n`);
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Errore critico durante export:');
    console.error(error);
    process.exit(1);
  }
})();

/**
 * Helper: Get last assessment date from assessments object
 */
function getLastAssessmentDate(assessments) {
  if (!assessments || Object.keys(assessments).length === 0) {
    return null;
  }

  const dates = Object.values(assessments)
    .map(a => a.assessment_date)
    .filter(d => d)
    .map(d => new Date(d));

  if (dates.length === 0) {
    return null;
  }

  return new Date(Math.max(...dates)).toISOString();
}

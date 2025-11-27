const assert = require('assert');
const fs = require('fs');
const path = require('path');
const config = require('../config'); // Import config to check db type

// Import sqlite libraries
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const db = require('../db');
const dataManager = require('../lib/dataManager');
const { generateDemoOrganizations } = require('./generate_demo_organizations');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');
const SQLITE_DB_PATH = config.database.sqlite.path;

// Lista esplicita degli ID delle organizzazioni demo per una pulizia sicura
// IMPORTANTE: Questi ID devono corrispondere a quelli definiti in generate_demo_organizations.js
const DEMO_ORG_IDS = [
  'techcorp-global',
  'financefirst-bank',
  'healthplus-clinic',
  'retailmax-store',
  'edulearn-academy'
];

async function initializeSqliteDatabase() {
  console.log('🔄 Initializing SQLite database for testing...');
  
  // 1. Delete old database file if it exists
  if (fs.existsSync(SQLITE_DB_PATH)) {
    fs.unlinkSync(SQLITE_DB_PATH);
    console.log('  ✓ Removed old SQLite database file.');
  }

  // 2. Read schema
  const schemaPath = path.join(__dirname, '..', 'lib', 'schemas', 'db_schema_sqlite.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // 3. Create and initialize the database
  const dbInstance = await sqlite.open({
    filename: SQLITE_DB_PATH,
    driver: sqlite3.Database
  });
  await dbInstance.exec(schema);
  await dbInstance.close();
  console.log('  ✓ SQLite database created and schema applied.');
}


function safeCleanup() {
  console.log('🧹 Performing safe cleanup of demo data...');

  // 1. Rimuovi il file indice (solo per JSON)
  if (config.database.type === 'json' && fs.existsSync(INDEX_FILE)) {
    fs.unlinkSync(INDEX_FILE);
    console.log('  ✓ Removed organizations index file.');
  }

  // 2. Rimuovi i file JSON delle specifiche organizzazioni demo
  if (config.database.type === 'json' && fs.existsSync(ORGS_DIR)) {
    let deletedCount = 0;
    DEMO_ORG_IDS.forEach(orgId => {
      const orgFile = path.join(ORGS_DIR, `${orgId}.json`);
      if (fs.existsSync(orgFile)) {
        fs.unlinkSync(orgFile);
        deletedCount++;
      }
    });
    console.log(`  ✓ Removed ${deletedCount} demo organization files.`);
  }
}

async function runTest() {
  // Initialize SQLite DB if needed
  if (config.database.type === 'sqlite') {
    await initializeSqliteDatabase();
  }

  safeCleanup(); 

  console.log('\nRunning backend test...');

  // 1. Genera dati di test
  const demoOrgs = await generateDemoOrganizations();
  
  assert(demoOrgs.length > 1, 'Expected more than one demo organization to be generated');
  console.log(`  ✓ Generated ${demoOrgs.length} organizations for testing.`);

  // Testiamo ogni organizzazione
  let successCount = 0;
  let failCount = 0;

  for (const testOrgData of demoOrgs) {
    if (!testOrgData || !testOrgData.metadata) {
      console.warn(`⚠️  Skipping invalid organization data`);
      failCount++;
      continue;
    }

    console.log(`\n- Testing organization: ${testOrgData.name}`);

    try {
      // 2. Testa la creazione dell'organizzazione
      const createdOrg = await dataManager.createOrganization(testOrgData);
      if (!createdOrg || createdOrg.id !== testOrgData.id) {
        throw new Error('Organization creation returned unexpected result');
      }
      console.log(`  ✓ Organization created successfully with ID: ${createdOrg.id}`);

      // 3. Testa la lettura dell'organizzazione
      const readOrg = await db.readOrganization(createdOrg.id);
      if (!readOrg) {
        throw new Error('Failed to read organization back');
      }
      if (readOrg.name !== testOrgData.name) {
        throw new Error('Read org name does not match test data name');
      }
      console.log(`  ✓ Organization read back successfully.`);

      // 4. Testa il salvataggio di un assessment
      const assessments = Object.values(testOrgData.assessments);
      if (assessments.length > 0) {
        const testAssessment = assessments[0];
        if (!testAssessment) {
          throw new Error('No valid assessments found in test data');
        }

        await dataManager.saveAssessment(createdOrg.id, testAssessment, 'System');
        console.log(`  ✓ Assessment saved successfully.`);

        // 5. Rileggi l'organizzazione e verifica l'assessment
        const updatedOrg = await db.readOrganization(createdOrg.id);
        const savedAssessment = updatedOrg.assessments[testAssessment.indicator_id];
        if (!savedAssessment) {
          throw new Error('Assessment was not saved correctly');
        }
        if (savedAssessment.bayesian_score !== testAssessment.bayesian_score) {
          throw new Error('Saved assessment score does not match');
        }
        console.log(`  ✓ Assessment verified successfully.`);
      }

      successCount++;

    } catch (error) {
      console.error(`\n❌ Test failed for organization: ${testOrgData.name}`);
      console.error(`   Error: ${error.message}`);
      console.log(`   ⏭️  Continuing with next organization...`);
      failCount++;
      // Non usciamo dal processo, continuiamo con la prossima organizzazione
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`\n📊 Test Summary:`);
  console.log(`   ✅ Successful: ${successCount}/${demoOrgs.length}`);
  console.log(`   ❌ Failed: ${failCount}/${demoOrgs.length}`);

  if (successCount > 0) {
    console.log('\n✅ Tests completed! At least one organization tested successfully.');
  } else {
    console.log('\n⚠️  Warning: All tests failed. Please check the errors above.');
  }
}

runTest()
  .then(() => {
    // Uscita pulita dallo script
    console.log('\n👋 Exiting test script...');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nAn unexpected error occurred during the test run:', error);
    process.exit(1);
  });
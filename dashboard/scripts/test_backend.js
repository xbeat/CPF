const assert = require('assert');
const fs = require('fs');
const path = require('path');
const config = require('../config'); // Import config to check db type

// Import sqlite libraries
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const db = require('../db');
const { generateDemoOrganizations } = require('./generate_demo_organizations');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');
const SQLITE_DB_PATH = config.database.sqlite.path;

// Lista esplicita degli ID delle organizzazioni demo per una pulizia sicura
const DEMO_ORG_IDS = [
  'org-demo-001', 
  'org-demo-002', 
  'org-demo-003', 
  'org-demo-004', 
  'org-demo-005'
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
  for (const testOrgData of demoOrgs) {
    assert(testOrgData, 'Failed to generate test organization data');
    assert(testOrgData.metadata, 'Generated data is missing metadata');

    console.log(`\n- Testing organization: ${testOrgData.name}`);

    try {
      // 2. Testa la creazione dell'organizzazione
      const createdOrg = await db.createOrganization(testOrgData);
      assert(createdOrg, 'db.createOrganization should return the created organization');
      assert.deepStrictEqual(createdOrg.id, testOrgData.id, 'Created org ID should match test data ID');
      console.log(`  ✓ Organization created successfully with ID: ${createdOrg.id}`);

      // 3. Testa la lettura dell'organizzazione
      const readOrg = await db.readOrganization(createdOrg.id);
      assert(readOrg, 'Failed to read organization back');
      assert.deepStrictEqual(readOrg.name, testOrgData.name, 'Read org name should match test data name');
      console.log(`  ✓ Organization read back successfully.`);

      // 4. Testa il salvataggio di un assessment
      const assessments = Object.values(testOrgData.assessments);
      if (assessments.length > 0) {
        const testAssessment = assessments[0];
        assert(testAssessment, 'No assessments found in test data');

        await db.saveAssessment(createdOrg.id, testAssessment.indicator_id, testAssessment);
        console.log(`  ✓ Assessment saved successfully.`);

        // 5. Rileggi l'organizzazione e verifica l'assessment
        const updatedOrg = await db.readOrganization(createdOrg.id);
        const savedAssessment = updatedOrg.assessments[testAssessment.indicator_id];
        assert(savedAssessment, 'Assessment was not saved correctly');
        assert.deepStrictEqual(savedAssessment.bayesian_score, testAssessment.bayesian_score, 'Saved assessment score should match');
        console.log(`  ✓ Assessment verified successfully.`);
      }

    } catch (error) {
      console.error(`\n❌ Test failed for organization: ${testOrgData.name}`, error);
      process.exit(1);
    }
  }
  
  console.log('\n✅ All backend tests completed successfully!');
}

runTest().catch(error => {
  console.error('\nAn unexpected error occurred during the test run:', error);
  process.exit(1);
});
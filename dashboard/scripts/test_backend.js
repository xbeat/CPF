const assert = require('assert');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { generateDemoOrganizations } = require('./generate_demo_organizations');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');

// Lista esplicita degli ID delle organizzazioni demo per una pulizia sicura
const DEMO_ORG_IDS = [
  'org-demo-001', 
  'org-demo-002', 
  'org-demo-003', 
  'org-demo-004', 
  'org-demo-005'
];

function safeCleanup() {
  console.log('🧹 Performing safe cleanup of demo data...');

  // 1. Rimuovi il file indice
  if (fs.existsSync(INDEX_FILE)) {
    fs.unlinkSync(INDEX_FILE);
    console.log('  ✓ Removed organizations index file.');
  }

  // 2. Rimuovi i file JSON delle specifiche organizzazioni demo
  if (fs.existsSync(ORGS_DIR)) {
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
  safeCleanup(); // Usa la nuova funzione di pulizia sicura

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

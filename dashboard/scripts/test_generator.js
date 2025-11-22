const assert = require('assert');
const { generateDemoOrganizations } = require('./generate_demo_organizations');

async function testGenerator() {
  console.log('Running data generator test...');

  try {
    const demoOrgs = await generateDemoOrganizations();

    // 1. Controllo di base: è un array con contenuti?
    assert(Array.isArray(demoOrgs), 'Generator should return an array.');
    assert(demoOrgs.length > 0, 'Generator should produce at least one organization.');
    console.log(`  ✓ Generated ${demoOrgs.length} organizations.`);

    // 2. Controllo approfondito sulla prima organizzazione
    const org = demoOrgs[0];
    console.log(`  - Checking structure of organization: ${org.name} (${org.id})`);

    // Chiavi di primo livello
    assert(org.id && typeof org.id === 'string', 'Organization missing or invalid id');
    assert(org.name && typeof org.name === 'string', 'Organization missing or invalid name');
    assert(org.metadata && typeof org.metadata === 'object', 'Organization missing metadata');
    assert(org.assessments && typeof org.assessments === 'object', 'Organization missing assessments');
    assert(org.aggregates && typeof org.aggregates === 'object', 'Organization missing aggregates');
    console.log('    ✓ Top-level keys are present.');

    // Dentro i metadati
    assert(org.metadata.industry, 'Metadata missing industry');
    assert(org.metadata.size, 'Metadata missing size');
    assert(org.metadata.country, 'Metadata missing country');
    console.log('    ✓ Metadata structure is valid.');

    // Dentro gli assessment
    const assessmentKeys = Object.keys(org.assessments);
    assert(assessmentKeys.length > 0, 'Assessments object should not be empty.');
    const firstAssessment = org.assessments[assessmentKeys[0]];
    assert(firstAssessment.indicator_id, 'Assessment missing indicator_id');
    assert.strictEqual(typeof firstAssessment.bayesian_score, 'number', 'Assessment bayesian_score should be a number');
    console.log('    ✓ Assessments structure is valid.');
    
    // Dentro gli aggregati
    assert(org.aggregates.completion, 'Aggregates missing completion data');
    assert.strictEqual(typeof org.aggregates.completion.percentage, 'number', 'Completion percentage should be a number');
    assert(org.aggregates.by_category, 'Aggregates missing by_category data');
    console.log('    ✓ Aggregates structure is valid.');

    console.log('\n✅ Data generator test completed successfully!');

  } catch (error) {
    console.error('\nGenerator test failed:', error);
    process.exit(1);
  }
}

testGenerator();

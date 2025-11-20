#!/usr/bin/env node

/**
 * CPF Demo Organizations Generator
 * Generates 5 demo organizations with random assessments (JSON file-based)
 *
 * Usage: node dashboard/scripts/generate_demo_organizations.js
 *
 * Output:
 * - /dashboard/data/organizations_index.json
 * - /dashboard/data/organizations/org-demo-001.json (x5)
 *
 * Behavior:
 * - ADDS new organizations without overwriting existing ones
 * - SKIPS organizations with duplicate IDs
 * - Preserves existing organizations in the database
 *
 * Reset/Clean Start:
 * To delete all demo data and start fresh, remove these files/folders:
 *   rm -f dashboard/data/organizations_index.json
 *   rm -rf dashboard/data/organizations/
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Configuration
// ============================================================================

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');

const DEMO_ORGANIZATIONS = [
  {
    id: 'org-demo-001',
    name: 'TechCorp Global',
    industry: 'Technology',
    size: 'enterprise',
    country: 'US',
    language: 'en-US',
    created_by: 'System',
    notes: 'Large technology company with global operations',
    sede_sociale: '100 Innovation Drive, San Francisco, CA 94105',
    partita_iva: 'US12-3456789'
  },
  {
    id: 'org-demo-002',
    name: 'FinanceFirst Bank',
    industry: 'Finance',
    size: 'enterprise',
    country: 'GB',
    language: 'en-US',
    created_by: 'System',
    notes: 'International banking institution',
    sede_sociale: '25 Bank Street, London, E14 5JP',
    partita_iva: 'GB123456789'
  },
  {
    id: 'org-demo-003',
    name: 'HealthPlus Clinic',
    industry: 'Healthcare',
    size: 'medium',
    country: 'IT',
    language: 'it-IT',
    created_by: 'System',
    notes: 'Regional healthcare provider',
    sede_sociale: 'Via della Salute 15, 00185 Roma (RM)',
    partita_iva: 'IT12345678901'
  },
  {
    id: 'org-demo-004',
    name: 'RetailMax Store',
    industry: 'Retail',
    size: 'small',
    country: 'DE',
    language: 'de-DE',
    created_by: 'System',
    notes: 'Retail chain with e-commerce platform',
    sede_sociale: 'Marktstraße 42, 10117 Berlin',
    partita_iva: 'DE123456789'
  },
  {
    id: 'org-demo-005',
    name: 'EduLearn Academy',
    industry: 'Education',
    size: 'medium',
    country: 'FR',
    language: 'fr-FR',
    created_by: 'System',
    notes: 'Online education platform',
    sede_sociale: '8 Rue de l\'Éducation, 75001 Paris',
    partita_iva: 'FR12345678901'
  }
];

const ASSESSORS = [
  'Alice Johnson',
  'Bob Smith',
  'Carlo Rossi',
  'Diana Chen',
  'Emma Garcia'
];

const CATEGORY_NAMES = {
  '1': 'Authority-Based Vulnerabilities',
  '2': 'Temporal-Based Vulnerabilities',
  '3': 'Social-Based Vulnerabilities',
  '4': 'Affective-Based Vulnerabilities',
  '5': 'Cognitive-Based Vulnerabilities',
  '6': 'Group-Based Vulnerabilities',
  '7': 'Stress-Based Vulnerabilities',
  '8': 'Unconscious-Based Vulnerabilities',
  '9': 'AI-Enhanced Vulnerabilities',
  '10': 'Convergent Vulnerabilities'
};

// ============================================================================
// Helper Functions
// ============================================================================

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDateLastNDays(days) {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime).toISOString();
}

function generateAllIndicatorIds() {
  const indicators = [];
  for (let category = 1; category <= 10; category++) {
    for (let num = 1; num <= 10; num++) {
      indicators.push(`${category}.${num}`);
    }
  }
  return indicators;
}

function generateRandomIndicatorSubset() {
  const allIndicators = generateAllIndicatorIds();
  const numAssessments = randomInt(30, 70); // 30-70% completion
  const shuffled = allIndicators.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numAssessments);
}

function generateBayesianScore() {
  const rand = Math.random();
  if (rand < 0.2) {
    // 20% low risk (0.1 - 0.3)
    return randomBetween(0.1, 0.3);
  } else if (rand < 0.7) {
    // 50% medium risk (0.3 - 0.7)
    return randomBetween(0.3, 0.7);
  } else {
    // 30% high risk (0.7 - 0.95)
    return randomBetween(0.7, 0.95);
  }
}

function generateConfidence() {
  // Human assessments typically have high confidence
  return randomBetween(0.7, 0.95);
}

function generateMaturityLevel(score) {
  if (score < 0.3) return 'green';
  if (score < 0.7) return 'yellow';
  return 'red';
}

function generateRawData(indicatorId, bayesianScore) {
  // Generate quick_assessment_breakdown (matches client-integrated.js format)
  const quickAssessmentBreakdown = [];
  for (let i = 1; i <= 7; i++) {
    const score = randomBetween(0, 1);
    const weight = 1 / 7; // Equal weight
    quickAssessmentBreakdown.push({
      question: `Question ${i} for indicator ${indicatorId}`,
      response: randomChoice(['Yes', 'No', 'Partially', 'N/A']),
      score: parseFloat(score.toFixed(4)),
      weight: parseFloat(weight.toFixed(4)),
      weighted_score: parseFloat((score * weight).toFixed(4))
    });
  }

  const possibleFlags = [
    'No formal policy documented',
    'Staff unaware of procedures',
    'Inconsistent enforcement',
    'Recent security incidents',
    'Lack of training',
    'Insufficient resources',
    'Management oversight gaps',
    'Third-party dependencies'
  ];

  const redFlagsCount = randomInt(0, 3);
  const redFlags = [];
  for (let i = 0; i < redFlagsCount; i++) {
    redFlags.push(randomChoice(possibleFlags));
  }

  // Generate synthetic responses (matches client form structure)
  const responses = {};
  responses[`s0_i0`] = randomChoice(['low', 'medium', 'high']);
  responses[`s0_i1`] = randomChoice(['low', 'medium', 'high']);
  responses[`s0_i2`] = randomChoice(['low', 'medium', 'high']);

  // Add some conversation responses
  for (let i = 0; i < randomInt(5, 10); i++) {
    responses[`s1_i${i}_f0`] = `Sample response for conversation question ${i}`;
  }

  // Generate scores object (matches currentScore structure)
  const scores = {
    quick_assessment: parseFloat((bayesianScore * 0.8).toFixed(4)),
    conversation_depth: 0,
    red_flags: parseFloat((bayesianScore * 0.2).toFixed(4)),
    final_score: bayesianScore,
    maturity_level: generateMaturityLevel(bayesianScore),
    weights_used: {
      quick_assessment: 0.70,
      red_flags: 0.30,
      conversation_depth: 0
    }
  };

  // Generate metadata
  const metadata = {
    date: randomDateLastNDays(90).split('T')[0],
    auditor: randomChoice(ASSESSORS),
    client: '',
    status: randomChoice(['completed', 'in-progress', 'review']),
    notes: `Assessment notes for indicator ${indicatorId}. Organization shows ${randomChoice(['strong', 'moderate', 'weak'])} controls.`
  };

  return {
    quick_assessment: quickAssessmentBreakdown,
    client_conversation: {
      responses: responses,
      scores: scores,
      metadata: metadata,
      notes: metadata.notes,
      red_flags: redFlags
    }
  };
}

// ============================================================================
// Assessment Generation
// ============================================================================

function generateAssessment(indicatorId) {
  const bayesianScore = generateBayesianScore();
  const confidence = generateConfidence();
  const maturityLevel = generateMaturityLevel(bayesianScore);
  const assessor = randomChoice(ASSESSORS);
  const assessmentDate = randomDateLastNDays(90);
  const rawData = generateRawData(indicatorId, bayesianScore);

  const [category] = indicatorId.split('.');

  return {
    indicator_id: indicatorId,
    title: `Indicator ${indicatorId} Title`,
    category: CATEGORY_NAMES[category],
    bayesian_score: parseFloat(bayesianScore.toFixed(4)),
    confidence: parseFloat(confidence.toFixed(4)),
    maturity_level: maturityLevel,
    assessor: assessor,
    assessment_date: assessmentDate,
    raw_data: rawData
  };
}

// ============================================================================
// Aggregates Calculation
// ============================================================================

function calculateAggregates(assessments) {
  const assessmentArray = Object.values(assessments);

  if (assessmentArray.length === 0) {
    return {
      overall_risk: 0.5,
      overall_confidence: 0.0,
      trend: 'stable',
      by_category: {},
      completion: {
        total_indicators: 100,
        assessed_indicators: 0,
        percentage: 0.0,
        missing_indicators: generateAllIndicatorIds()
      },
      last_calculated: new Date().toISOString()
    };
  }

  // Overall stats
  const overallRisk = assessmentArray.reduce((sum, a) => sum + a.bayesian_score, 0) / assessmentArray.length;
  const overallConfidence = assessmentArray.reduce((sum, a) => sum + a.confidence, 0) / assessmentArray.length;

  // By category
  const byCategory = {};
  for (let cat = 1; cat <= 10; cat++) {
    const catKey = cat.toString();
    const catAssessments = assessmentArray.filter(a => a.indicator_id.startsWith(`${cat}.`));

    if (catAssessments.length > 0) {
      const avgScore = catAssessments.reduce((sum, a) => sum + a.bayesian_score, 0) / catAssessments.length;
      const avgConfidence = catAssessments.reduce((sum, a) => sum + a.confidence, 0) / catAssessments.length;

      byCategory[catKey] = {
        category_name: CATEGORY_NAMES[catKey],
        avg_score: parseFloat(avgScore.toFixed(4)),
        avg_confidence: parseFloat(avgConfidence.toFixed(4)),
        total_assessments: catAssessments.length,
        completion_percentage: parseFloat((catAssessments.length / 10 * 100).toFixed(2))
      };
    }
  }

  // Completion
  const allIndicators = generateAllIndicatorIds();
  const assessedIndicators = Object.keys(assessments);
  const missingIndicators = allIndicators.filter(id => !assessedIndicators.includes(id));

  return {
    overall_risk: parseFloat(overallRisk.toFixed(4)),
    overall_confidence: parseFloat(overallConfidence.toFixed(4)),
    trend: 'stable', // For demo, set as stable
    by_category: byCategory,
    completion: {
      total_indicators: 100,
      assessed_indicators: assessedIndicators.length,
      percentage: parseFloat((assessedIndicators.length / 100 * 100).toFixed(2)),
      missing_indicators: missingIndicators
    },
    last_calculated: new Date().toISOString()
  };
}

// ============================================================================
// Organization Generation
// ============================================================================

function generateOrganization(orgConfig) {
  const createdAt = new Date().toISOString();
  const indicatorsToAssess = generateRandomIndicatorSubset();

  // Generate assessments
  const assessments = {};
  for (const indicatorId of indicatorsToAssess) {
    assessments[indicatorId] = generateAssessment(indicatorId);
  }

  // Calculate aggregates
  const aggregates = calculateAggregates(assessments);

  // Build organization data
  const orgData = {
    id: orgConfig.id,
    name: orgConfig.name,
    metadata: {
      industry: orgConfig.industry,
      size: orgConfig.size,
      country: orgConfig.country,
      language: orgConfig.language,
      created_at: createdAt,
      updated_at: createdAt,
      created_by: orgConfig.created_by,
      notes: orgConfig.notes
    },
    assessments: assessments,
    aggregates: aggregates
  };

  return orgData;
}

// ============================================================================
// File Operations
// ============================================================================

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ============================================================================
// Main Generation Function
// ============================================================================

async function generateDemoOrganizations() {
  console.log('\n🌱 CPF Demo Organizations Generator\n');
  console.log('='.repeat(60));

  // Ensure directories exist
  ensureDirectoryExists(DATA_DIR);
  ensureDirectoryExists(ORGS_DIR);

  // Load existing index or create new one
  let organizationsIndex;
  if (fs.existsSync(INDEX_FILE)) {
    console.log('📂 Loading existing organizations index...');
    const existingData = fs.readFileSync(INDEX_FILE, 'utf8');
    organizationsIndex = JSON.parse(existingData);
    console.log(`   Found ${organizationsIndex.organizations.length} existing organizations\n`);
  } else {
    console.log('📂 Creating new organizations index...\n');
    organizationsIndex = {
      metadata: {
        version: '2.0',
        last_updated: new Date().toISOString(),
        total_organizations: 0
      },
      organizations: []
    };
  }

  // Create a map of existing organizations by ID for quick lookup
  const existingOrgsMap = new Map();
  for (const org of organizationsIndex.organizations) {
    existingOrgsMap.set(org.id, org);
  }

  let totalAssessments = 0;
  let addedCount = 0;
  let skippedCount = 0;

  // Generate each organization
  for (const orgConfig of DEMO_ORGANIZATIONS) {
    console.log(`\n📊 Processing: ${orgConfig.name}`);
    console.log('-'.repeat(60));

    // Check if organization already exists
    if (existingOrgsMap.has(orgConfig.id)) {
      console.log(`   ⏭️  SKIPPED: Organization "${orgConfig.id}" already exists`);
      skippedCount++;
      continue;
    }

    const orgData = generateOrganization(orgConfig);

    // Save organization file
    const orgFilePath = path.join(ORGS_DIR, `${orgConfig.id}.json`);
    writeJsonFile(orgFilePath, orgData);
    console.log(`   ✓ Saved: ${orgFilePath}`);

    // Add to index
    const indexEntry = {
      id: orgData.id,
      name: orgData.name,
      industry: orgData.metadata.industry,
      size: orgData.metadata.size,
      country: orgData.metadata.country,
      language: orgData.metadata.language,
      created_at: orgData.metadata.created_at,
      updated_at: orgData.metadata.updated_at,
      stats: {
        total_assessments: orgData.aggregates.completion.assessed_indicators,
        completion_percentage: orgData.aggregates.completion.percentage,
        overall_risk: orgData.aggregates.overall_risk,
        avg_confidence: orgData.aggregates.overall_confidence,
        last_assessment_date: Object.values(orgData.assessments)
          .sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date))[0]?.assessment_date
      }
    };

    organizationsIndex.organizations.push(indexEntry);
    addedCount++;

    const numAssessments = orgData.aggregates.completion.assessed_indicators;
    totalAssessments += numAssessments;

    // Display stats
    console.log(`   📈 Stats:`);
    console.log(`      - Assessments: ${numAssessments} / 100`);
    console.log(`      - Completion: ${orgData.aggregates.completion.percentage}%`);
    console.log(`      - Overall Risk: ${orgData.aggregates.overall_risk} (${getRiskLabel(orgData.aggregates.overall_risk)})`);
    console.log(`      - Avg Confidence: ${orgData.aggregates.overall_confidence}`);
  }

  // Update index metadata
  organizationsIndex.metadata.last_updated = new Date().toISOString();
  organizationsIndex.metadata.total_organizations = organizationsIndex.organizations.length;

  // Save index file
  writeJsonFile(INDEX_FILE, organizationsIndex);
  console.log(`\n✓ Saved index: ${INDEX_FILE}`);

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Generation completed!\n');
  console.log(`📊 Summary:`);
  console.log(`   - Organizations added: ${addedCount}`);
  console.log(`   - Organizations skipped (already exist): ${skippedCount}`);
  console.log(`   - Total organizations in database: ${organizationsIndex.organizations.length}`);
  console.log(`   - New assessments generated: ${totalAssessments}`);
  if (addedCount > 0) {
    console.log(`   - Average assessments per new org: ${Math.round(totalAssessments / addedCount)}`);
  }
  console.log();

  // Display table
  console.log('📋 Organizations:');
  console.log('-'.repeat(60));
  for (const org of organizationsIndex.organizations) {
    const riskLabel = getRiskLabel(org.stats.overall_risk);
    console.log(`   ${org.id}: ${org.name}`);
    console.log(`      ${org.industry} | ${org.size} | ${org.country}`);
    console.log(`      Risk: ${riskLabel} (${org.stats.overall_risk}) | Completion: ${org.stats.completion_percentage}%`);
    console.log();
  }

  console.log('✅ Files ready in:');
  console.log(`   ${DATA_DIR}/organizations_index.json`);
  console.log(`   ${ORGS_DIR}/org-demo-*.json`);
  console.log();
}

function getRiskLabel(score) {
  if (score < 0.3) return '🟢 LOW';
  if (score < 0.7) return '🟡 MEDIUM';
  return '🔴 HIGH';
}

// ============================================================================
// CLI Execution
// ============================================================================

if (require.main === module) {
  generateDemoOrganizations()
    .then(() => {
      console.log('✅ Demo organizations generated successfully!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error generating organizations:', error);
      process.exit(1);
    });
}

module.exports = { generateDemoOrganizations };

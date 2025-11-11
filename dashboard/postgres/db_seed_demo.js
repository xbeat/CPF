#!/usr/bin/env node

/**
 * CPF Database Seed Script
 * Generates demo data for 5 organizations with random assessments
 *
 * Usage: node dashboard/db_seed_demo.js
 *
 * Requirements:
 * - PostgreSQL running on localhost:5432
 * - Database 'cpf_db' created
 * - Schema applied (db_schema.sql)
 * - npm package 'pg' installed: npm install pg
 */

const { Pool } = require('pg');

// ============================================================================
// Database Configuration
// ============================================================================

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cpf_db',
  user: process.env.DB_USER || process.env.USER,
  password: process.env.DB_PASSWORD || '',
});

// ============================================================================
// Demo Data Configuration
// ============================================================================

const DEMO_ORGANIZATIONS = [
  {
    id: 'org-demo-001',
    name: 'TechCorp Global',
    industry: 'Technology',
    size: 'enterprise',
    country: 'US',
  },
  {
    id: 'org-demo-002',
    name: 'FinanceFirst Bank',
    industry: 'Finance',
    size: 'enterprise',
    country: 'GB',
  },
  {
    id: 'org-demo-003',
    name: 'HealthPlus Clinic',
    industry: 'Healthcare',
    size: 'medium',
    country: 'IT',
  },
  {
    id: 'org-demo-004',
    name: 'RetailMax Store',
    industry: 'Retail',
    size: 'small',
    country: 'DE',
  },
  {
    id: 'org-demo-005',
    name: 'EduLearn Academy',
    industry: 'Education',
    size: 'medium',
    country: 'FR',
  },
];

const ASSESSORS = [
  'Alice Johnson',
  'Bob Smith',
  'Carlo Rossi',
  'Diana Chen',
  'Emma Garcia',
];

const INDICATOR_CATEGORIES = {
  1: 'Authority-Based Vulnerabilities',
  2: 'Temporal-Based Vulnerabilities',
  3: 'Social-Based Vulnerabilities',
  4: 'Affective-Based Vulnerabilities',
  5: 'Cognitive-Based Vulnerabilities',
  6: 'Group-Based Vulnerabilities',
  7: 'Stress-Based Vulnerabilities',
  8: 'Unconscious-Based Vulnerabilities',
  9: 'AI-Enhanced Vulnerabilities',
  10: 'Convergent Vulnerabilities',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate random number between min and max
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random item from array
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random date within last N days
 */
function randomDateLastNDays(days) {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime);
}

/**
 * Generate all 100 indicator IDs (1.1 to 10.10)
 */
function generateAllIndicatorIds() {
  const indicators = [];
  for (let category = 1; category <= 10; category++) {
    for (let num = 1; num <= 10; num++) {
      indicators.push(`${category}.${num}`);
    }
  }
  return indicators;
}

/**
 * Generate random subset of indicators (30-70% completion)
 */
function generateRandomIndicatorSubset() {
  const allIndicators = generateAllIndicatorIds();
  const numAssessments = randomInt(30, 70); // 30-70 assessments per org

  // Shuffle and pick random subset
  const shuffled = allIndicators.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numAssessments);
}

/**
 * Generate realistic raw_data for assessment
 */
function generateRawData(indicatorId) {
  // Simulate Quick Assessment answers (7 questions, 4 options each)
  const quickAssessment = [];
  for (let i = 1; i <= 7; i++) {
    quickAssessment.push({
      question_id: `q${i}`,
      answer: randomChoice(['option_a', 'option_b', 'option_c', 'option_d']),
      weight: randomBetween(0.1, 0.3),
    });
  }

  // Simulate Client Conversation
  const clientConversation = {
    notes: `Assessment notes for indicator ${indicatorId}. Client shows ${randomChoice(['strong', 'moderate', 'weak'])} controls in this area.`,
    red_flags_identified: randomInt(0, 3),
    red_flags: [],
  };

  // Add some random red flags
  const possibleFlags = [
    'No formal policy documented',
    'Staff unaware of procedures',
    'Inconsistent enforcement',
    'Recent security incidents',
    'Lack of training',
    'Insufficient resources',
    'Management oversight gaps',
    'Third-party dependencies',
  ];

  for (let i = 0; i < clientConversation.red_flags_identified; i++) {
    clientConversation.red_flags.push(randomChoice(possibleFlags));
  }

  return {
    quick_assessment: quickAssessment,
    client_conversation: clientConversation,
    maturity_level: randomChoice(['green', 'yellow', 'red']),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate Bayesian score based on maturity level
 */
function generateBayesianScore() {
  // Generate score with realistic distribution
  // More scores in middle range, fewer at extremes
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

/**
 * Generate confidence score (usually high for human assessments)
 */
function generateConfidence() {
  // Human assessments typically have high confidence
  return randomBetween(0.7, 0.95);
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Insert organization into database
 */
async function insertOrganization(org) {
  const query = `
    INSERT INTO organizations (id, name, industry, size, country)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      industry = EXCLUDED.industry,
      size = EXCLUDED.size,
      country = EXCLUDED.country,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const values = [org.id, org.name, org.industry, org.size, org.country];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Insert assessment into database
 */
async function insertAssessment(orgId, indicatorId) {
  const query = `
    INSERT INTO assessments (
      org_id,
      indicator_id,
      bayesian_score,
      confidence,
      assessor,
      assessment_date,
      raw_data
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (org_id, indicator_id) DO UPDATE SET
      bayesian_score = EXCLUDED.bayesian_score,
      confidence = EXCLUDED.confidence,
      assessor = EXCLUDED.assessor,
      assessment_date = EXCLUDED.assessment_date,
      raw_data = EXCLUDED.raw_data
    RETURNING *;
  `;

  const bayesianScore = generateBayesianScore();
  const confidence = generateConfidence();
  const assessor = randomChoice(ASSESSORS);
  const assessmentDate = randomDateLastNDays(90); // Last 90 days
  const rawData = generateRawData(indicatorId);

  const values = [
    orgId,
    indicatorId,
    bayesianScore.toFixed(4),
    confidence.toFixed(4),
    assessor,
    assessmentDate,
    JSON.stringify(rawData),
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Get organization statistics
 */
async function getOrgStats(orgId) {
  const query = `
    SELECT
      COUNT(*) as total_assessments,
      ROUND(AVG(bayesian_score)::numeric, 4) as avg_risk_score,
      ROUND(AVG(confidence)::numeric, 4) as avg_confidence,
      ROUND((COUNT(*)::decimal / 100 * 100), 2) as completion_percentage
    FROM assessments
    WHERE org_id = $1;
  `;

  const result = await pool.query(query, [orgId]);
  return result.rows[0];
}

// ============================================================================
// Main Seed Function
// ============================================================================

async function seedDatabase() {
  console.log('\n🌱 Starting CPF Database Seed...\n');
  console.log('=' .repeat(60));

  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL database\n');

    let totalOrgsCreated = 0;
    let totalAssessmentsCreated = 0;

    // Process each organization
    for (const org of DEMO_ORGANIZATIONS) {
      console.log(`\n📊 Processing: ${org.name}`);
      console.log('-'.repeat(60));

      // Insert organization
      const insertedOrg = await insertOrganization(org);
      console.log(`   ✓ Organization created: ${insertedOrg.id}`);
      totalOrgsCreated++;

      // Generate random subset of indicators
      const indicatorsToAssess = generateRandomIndicatorSubset();
      console.log(`   ✓ Generating ${indicatorsToAssess.length} assessments...`);

      // Insert assessments
      let assessmentsCreated = 0;
      for (const indicatorId of indicatorsToAssess) {
        await insertAssessment(org.id, indicatorId);
        assessmentsCreated++;

        // Progress indicator every 10 assessments
        if (assessmentsCreated % 10 === 0) {
          process.stdout.write('.');
        }
      }

      console.log(`\n   ✓ Created ${assessmentsCreated} assessments`);
      totalAssessmentsCreated += assessmentsCreated;

      // Get and display statistics
      const stats = await getOrgStats(org.id);
      console.log(`   📈 Stats:`);
      console.log(`      - Completion: ${stats.completion_percentage}%`);
      console.log(`      - Avg Risk Score: ${stats.avg_risk_score}`);
      console.log(`      - Avg Confidence: ${stats.avg_confidence}`);
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Database seed completed successfully!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Organizations created: ${totalOrgsCreated}`);
    console.log(`   - Total assessments created: ${totalAssessmentsCreated}`);
    console.log(`   - Average assessments per org: ${Math.round(totalAssessmentsCreated / totalOrgsCreated)}`);

    // Display organizations table
    console.log('\n📋 Organizations:');
    console.log('-'.repeat(60));
    const orgsResult = await pool.query('SELECT * FROM v_organization_risk_summary ORDER BY id;');
    orgsResult.rows.forEach(org => {
      const riskLabel = org.avg_risk_score < 0.3 ? '🟢 LOW' :
                       org.avg_risk_score < 0.7 ? '🟡 MEDIUM' : '🔴 HIGH';
      console.log(`   ${org.id}: ${org.name}`);
      console.log(`      Industry: ${org.industry} | Size: ${org.size}`);
      console.log(`      Risk: ${riskLabel} (${org.avg_risk_score}) | Completion: ${org.completion_percentage}%`);
      console.log();
    });

    // Verification queries
    console.log('\n🔍 Verification Queries:');
    console.log('-'.repeat(60));
    console.log('\nTo view organizations:');
    console.log('   psql cpf_db -c "SELECT * FROM v_organization_risk_summary;"');
    console.log('\nTo view recent assessments:');
    console.log('   psql cpf_db -c "SELECT * FROM v_recent_assessments LIMIT 10;"');
    console.log('\nTo get missing indicators for an org:');
    console.log('   psql cpf_db -c "SELECT * FROM get_missing_indicators(\'org-demo-001\');"');
    console.log('\nTo calculate completion rate:');
    console.log('   psql cpf_db -c "SELECT get_org_completion_rate(\'org-demo-001\');"');
    console.log();

  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// ============================================================================
// CLI Execution
// ============================================================================

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed script completed. Database is ready!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    });
}

// Export for programmatic use
module.exports = { seedDatabase, pool };
